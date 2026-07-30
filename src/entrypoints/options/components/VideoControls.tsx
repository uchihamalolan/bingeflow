import { getMessage } from "@/common/browser";
import NumberInput from "@/common/components/NumberInput";
import Switch from "@/common/components/Switch";
import { cx } from "@/common/utils/cx";
import type { VideoControlsConfig } from "@/common/video-controls";

const styles = {
  section: cx({
    layout: "flex flex-col gap-5",
    colors: "bg-mantle",
    borders: "border-(~ surface0) rounded-2xl",
    spacing: "p-6",
  }),
  sectionTitle: cx({
    colors: "text-mauve",
    typography: "font-semibold text-lg",
  }),
  settingRow: (disabled: boolean) =>
    cx({
      layout: "flex items-center justify-between gap-5",
      state: disabled && "opacity-45 pointer-events-none",
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
};

interface Props {
  videoControls: VideoControlsConfig;
  onchange: (updater: (controls: VideoControlsConfig) => void) => void;
}

export default function VideoControls(props: Props) {
  return (
    <article class={styles.section}>
      <h2 class={styles.sectionTitle}>{getMessage("videoControlsTitle")}</h2>

      <div class={styles.settingRow(false)}>
        <dl class={styles.settingInfo}>
          <dt class={styles.settingLabel}>{getMessage("enableOverlayLabel")}</dt>
          <dd class={styles.settingDesc}>{getMessage("enableOverlayDesc")}</dd>
        </dl>
        <Switch
          id="enabled-toggle"
          ariaLabel={getMessage("enableOverlayLabel")}
          checked={props.videoControls.enabled}
          onchange={(checked) => {
            props.onchange((c) => {
              c.enabled = checked;
            });
          }}
        />
      </div>

      <div class={styles.settingRow(!props.videoControls.enabled)}>
        <dl class={styles.settingInfo}>
          <dt class={styles.settingLabel}>{getMessage("seekDurationLabel")}</dt>
          <dd class={styles.settingDesc}>{getMessage("seekDurationDesc")}</dd>
        </dl>
        <NumberInput
          value={props.videoControls.seekSeconds}
          disabled={!props.videoControls.enabled}
          min={1}
          max={60}
          step={1}
          unit="s"
          onchange={(val) => {
            props.onchange((c) => {
              c.seekSeconds = val;
            });
          }}
        />
      </div>

      <div class={styles.settingRow(!props.videoControls.enabled)}>
        <dl class={styles.settingInfo}>
          <dt class={styles.settingLabel}>{getMessage("playbackSpeedStepLabel")}</dt>
          <dd class={styles.settingDesc}>{getMessage("playbackSpeedStepDesc")}</dd>
        </dl>
        <NumberInput
          value={props.videoControls.speedStep}
          disabled={!props.videoControls.enabled}
          min={0.05}
          max={2.0}
          step={0.05}
          unit="×"
          onchange={(val) => {
            props.onchange((c) => {
              c.speedStep = val;
            });
          }}
        />
      </div>

      <div class={styles.settingRow(!props.videoControls.enabled)}>
        <dl class={styles.settingInfo}>
          <dt class={styles.settingLabel}>{getMessage("startHiddenLabel")}</dt>
          <dd class={styles.settingDesc}>{getMessage("startHiddenDesc")}</dd>
        </dl>
        <Switch
          id="start-hidden-toggle"
          ariaLabel={getMessage("startHiddenLabel")}
          checked={props.videoControls.startHidden}
          disabled={!props.videoControls.enabled}
          onchange={(checked) => {
            props.onchange((c) => {
              c.startHidden = checked;
            });
          }}
        />
      </div>
    </article>
  );
}
