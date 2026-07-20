import { clsx } from "clsx";
import { createSignal, For, onCleanup, onMount } from "solid-js";

import { getMessage } from "@/common/browser";
import type { VideoControlsConfig } from "@/common/video-controls";
import { DEFAULT_VIDEO_CONTROLS } from "@/common/video-controls";

import KbdButton from "./KbdButton";
import ResetButton from "./ResetButton";

const styles = {
  section: (disabled: boolean) =>
    clsx(
      "bg-mantle border-(~ surface0) rounded-2xl p-6 flex flex-col gap-5",
      disabled && "opacity-45 pointer-events-none",
    ),
  sectionTitle: "text-mauve font-semibold text-lg",
  shortcutList: "flex flex-col gap-3",
  shortcutItem: "flex items-center justify-between py-2 border-(b surface0) last:border-none",
  shortcutLabel: "font-medium",
  shortcutActions: "flex items-center gap-3",
};

interface Props {
  videoControls: VideoControlsConfig;
  onchange: (updater: (controls: VideoControlsConfig) => void) => void;
}

type BindingKey = keyof VideoControlsConfig["keyBindings"];

const shortcutConfigs: { id: BindingKey }[] = [
  { id: "seekBack" },
  { id: "seekFwd" },
  { id: "speedDown" },
  { id: "speedUp" },
  { id: "resetSpeed" },
];

const getShortcutLabel = (id: BindingKey) => {
  if (id === "seekBack") return getMessage("shortcutSeekBackward");
  if (id === "seekFwd") return getMessage("shortcutSeekForward");
  if (id === "speedDown") return getMessage("shortcutDecreaseSpeed");
  if (id === "speedUp") return getMessage("shortcutIncreaseSpeed");
  if (id === "resetSpeed") return getMessage("shortcutResetSpeed");
  return id;
};

function formatKey(key: string): string {
  if (key === " ") return getMessage("spaceKeyLabel");
  if (key.length === 1) return key.toUpperCase();
  return key;
}

export default function KeyboardShortcuts(props: Props) {
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

    props.onchange((c) => {
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

  const resetKey = (key: BindingKey) => {
    props.onchange((c) => {
      c.keyBindings[key] = DEFAULT_VIDEO_CONTROLS.keyBindings[key];
    });
  };

  return (
    <article class={styles.section(!props.videoControls.enabled)}>
      <h2 class={styles.sectionTitle}>{getMessage("keyboardShortcutsTitle")}</h2>

      <dl class={styles.shortcutList}>
        <For each={shortcutConfigs}>
          {({ id }) => (
            <div class={styles.shortcutItem}>
              <dt class={styles.shortcutLabel}>{getShortcutLabel(id)}</dt>
              <dd class={styles.shortcutActions}>
                <KbdButton
                   active={activeRebindKey() === id}
                  disabled={!props.videoControls.enabled}
                  value={formatKey(props.videoControls.keyBindings[id])}
                  onclick={() => setActiveRebindKey(id)}
                />
                <ResetButton
                  disabled={
                    !props.videoControls.enabled ||
                    props.videoControls.keyBindings[id] === DEFAULT_VIDEO_CONTROLS.keyBindings[id]
                  }
                  onclick={() => resetKey(id)}
                />
              </dd>
            </div>
          )}
        </For>
      </dl>
    </article>
  );
}
