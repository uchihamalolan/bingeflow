import { For } from "solid-js";

import Switch from "@/common/components/Switch";
import { getGamepadButtonLabel } from "@/common/gamepad-labels";
import { cx } from "@/common/utils/cx";
import type { VideoControlsConfig } from "@/common/video-controls";
import { DEFAULT_GAMEPAD_BINDINGS } from "@/common/video-controls";

import { type BoundActionKey, useGamepadRecorder } from "../hooks/useGamepadRecorder";
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
  settingRow: cx({
    layout: "flex items-center justify-between gap-5",
    borders: "border-b border-surface0",
    spacing: "pb-4",
  }),
  settingInfo: cx({
    layout: "flex flex-col gap-1 flex-1",
  }),
  settingLabel: cx({
    typography: "font-semibold",
  }),
  settingDesc: cx({
    typography: "text-xs text-subtext0",
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
    typography: "font-medium text-sm",
  }),
  shortcutActions: cx({
    layout: "flex items-center gap-3",
  }),
};

interface Props {
  videoControls: VideoControlsConfig;
  onchange: (updater: (controls: VideoControlsConfig) => void) => void;
}

const ACTIONS: { key: BoundActionKey; label: string }[] = [
  { key: "seekBack", label: "Seek Backward" },
  { key: "seekFwd", label: "Seek Forward" },
  { key: "speedDown", label: "Decrease Speed" },
  { key: "speedUp", label: "Increase Speed" },
  { key: "resetSpeed", label: "Reset Speed" },
  { key: "toggleOverlay", label: "Toggle Overlay" },
  { key: "togglePlay", label: "Play / Pause" },
];

export default function GamepadShortcuts(props: Props) {
  const { activeRebindKey, setActiveRebindKey } = useGamepadRecorder({
    onchange: props.onchange,
  });

  const isGamepadEnabled = () =>
    props.videoControls.enabled && (props.videoControls.gamepadBindings?.enabled ?? true);

  const toggleGamepad = (checked: boolean) => {
    props.onchange((c) => {
      c.gamepadBindings.enabled = checked;
    });
  };

  const resetKey = (key: BoundActionKey) => {
    props.onchange((c) => {
      c.gamepadBindings[key] = DEFAULT_GAMEPAD_BINDINGS[key];
    });
  };

  const header = (
    <div class={styles.settingRow}>
      <dl class={styles.settingInfo}>
        <dt class={styles.settingLabel}>Gamepad Shortcuts</dt>
        <dd class={styles.settingDesc}>Control video playback using a connected controller</dd>
      </dl>
      <Switch
        id="gamepad-enabled-toggle"
        ariaLabel="Enable Gamepad Shortcuts"
        checked={props.videoControls.gamepadBindings?.enabled ?? true}
        disabled={!props.videoControls.enabled}
        onchange={toggleGamepad}
      />
    </div>
  );

  return (
    <article class={styles.section(!props.videoControls.enabled)}>
      {header}

      <dl class={styles.shortcutList}>
        <For each={ACTIONS}>
          {({ key, label }) => {
            const isRecording = () => activeRebindKey() === key;
            const boundIndex = () => props.videoControls.gamepadBindings?.[key] ?? null;
            const isDisabled = () =>
              props.videoControls.gamepadBindings?.[key] === DEFAULT_GAMEPAD_BINDINGS[key];

            return (
              <div class={styles.shortcutItem}>
                <dt class={styles.shortcutLabel}>{label}</dt>
                <dd class={styles.shortcutActions}>
                  <KbdButton
                    active={isRecording()}
                    disabled={!isGamepadEnabled()}
                    value={getGamepadButtonLabel(boundIndex())}
                    onclick={() => setActiveRebindKey(key)}
                  />
                  <ResetButton
                    disabled={!isGamepadEnabled() || isDisabled()}
                    onclick={() => resetKey(key)}
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
