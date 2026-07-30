import { createSignal, onCleanup, onMount } from "solid-js";
import type { GamepadBindings, VideoControlsConfig } from "@/common/video-controls";

export type BoundActionKey = keyof Omit<GamepadBindings, "enabled">;

interface Props {
  onchange: (updater: (controls: VideoControlsConfig) => void) => void;
}

export function useGamepadRecorder({ onchange }: Props) {
  const [activeRebindKey, setActiveRebindKey] = createSignal<BoundActionKey | null>(null);
  let pollId: number | null = null;

  const handleKeydown = (event: KeyboardEvent) => {
    if (activeRebindKey() !== null && event.key === "Escape") {
      event.preventDefault();
      setActiveRebindKey(null);
    }
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeydown, true);

    const checkGamepadInput = () => {
      const activeKey = activeRebindKey();
      if (activeKey !== null) {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (const gp of gamepads) {
          if (!gp || !gp.connected) continue;
          for (let i = 0; i < gp.buttons.length; i++) {
            if (gp.buttons[i].pressed) {
              const pressedIndex = i;
              onchange((c) => {
                c.gamepadBindings[activeKey] = pressedIndex;
              });
              setActiveRebindKey(null);
              break;
            }
          }
        }
      }
      pollId = requestAnimationFrame(checkGamepadInput);
    };

    pollId = requestAnimationFrame(checkGamepadInput);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeydown, true);
    if (pollId !== null) {
      cancelAnimationFrame(pollId);
    }
  });

  return {
    activeRebindKey,
    setActiveRebindKey,
  };
}
