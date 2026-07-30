import { For } from "solid-js";

import { getMessage } from "@/common/browser";
import { cx } from "@/common/utils/cx";
import type { VideoControlsConfig } from "@/common/video-controls";
import { DEFAULT_VIDEO_CONTROLS } from "@/common/video-controls";

import { type BindingKey, useKeyboardRecorder } from "../hooks/useKeyboardRecorder";
import KbdButton from "./KbdButton";
import ResetButton from "./ResetButton";

const styles = {
  section: (disabled: boolean) =>
    cx({
      layout: "flex flex-col gap-5",
      colors: "bg-mantle",
      borders: "border-(~ surface0) rounded-2xl",
      spacing: "p-6",
      state: disabled && "opacity-45 pointer-events-none",
    }),
  sectionTitle: cx({
    colors: "text-mauve",
    typography: "font-semibold text-lg",
  }),
  shortcutList: cx({
    layout: "flex flex-col gap-3",
  }),
  shortcutItem: cx({
    layout: "flex items-center justify-between",
    borders: "border-b border-surface0 last:border-none",
    spacing: "py-2",
  }),
  shortcutLabel: cx({
    typography: "font-medium",
  }),
  shortcutActions: cx({
    layout: "flex items-center gap-3",
  }),
};

interface Props {
  videoControls: VideoControlsConfig;
  onchange: (updater: (controls: VideoControlsConfig) => void) => void;
}

const shortcutConfigs: { id: BindingKey }[] = [
  { id: "seekBack" },
  { id: "seekFwd" },
  { id: "speedDown" },
  { id: "speedUp" },
  { id: "resetSpeed" },
  { id: "toggleOverlay" },
];

const getShortcutLabel = (id: BindingKey) => {
  if (id === "seekBack") return getMessage("shortcutSeekBackward");
  if (id === "seekFwd") return getMessage("shortcutSeekForward");
  if (id === "speedDown") return getMessage("shortcutDecreaseSpeed");
  if (id === "speedUp") return getMessage("shortcutIncreaseSpeed");
  if (id === "resetSpeed") return getMessage("shortcutResetSpeed");
  if (id === "toggleOverlay") return "Toggle Overlay";
  return id;
};

function formatKey(key: string): string {
  if (key === " ") return getMessage("spaceKeyLabel");
  if (key.length === 1) return key.toUpperCase();
  return key;
}

export default function KeyboardShortcuts(props: Props) {
  const { activeRebindKey, setActiveRebindKey } = useKeyboardRecorder({
    onchange: props.onchange,
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
          {({ id }) => {
            const isDisabled = () =>
              props.videoControls.keyBindings[id] === DEFAULT_VIDEO_CONTROLS.keyBindings[id];

            return (
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
                    disabled={!props.videoControls.enabled || isDisabled()}
                    onclick={() => resetKey(id)}
                  />
                </dd>
              </div>
            );
          }}
        </For>
      </dl>
    </article>
  );
}
