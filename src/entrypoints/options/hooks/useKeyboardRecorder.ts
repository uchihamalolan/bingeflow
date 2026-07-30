import { createSignal, onCleanup, onMount } from "solid-js";
import type { VideoControlsConfig } from "@/common/video-controls";

export type BindingKey = keyof VideoControlsConfig["keyBindings"];

interface Props {
  onchange: (updater: (controls: VideoControlsConfig) => void) => void;
}

export function useKeyboardRecorder({ onchange }: Props) {
  const [activeRebindKey, setActiveRebindKey] = createSignal<BindingKey | null>(null);

  const handleKeydown = (event: KeyboardEvent) => {
    const key = activeRebindKey();
    if (!key) return;

    event.preventDefault();
    event.stopPropagation();

    if (event.key === "Escape") {
      setActiveRebindKey(null);
      return;
    }

    if (["Control", "Shift", "Alt", "Meta"].includes(event.key)) {
      return;
    }

    onchange((c) => {
      c.keyBindings[key] = event.key;
    });
    setActiveRebindKey(null);
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeydown, true);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeydown, true);
  });

  return {
    activeRebindKey,
    setActiveRebindKey,
  };
}
