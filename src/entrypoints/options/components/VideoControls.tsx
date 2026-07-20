import { clsx } from "clsx";

import { getMessage } from "@/common/browser";
import NumberInput from "@/common/components/NumberInput";
import Switch from "@/common/components/Switch";
import type { VideoControlsConfig } from "@/common/video-controls";

const styles = {
  section: "bg-mantle border-(~ surface0) rounded-2xl p-6 flex flex-col gap-5",
  sectionTitle: "text-mauve font-semibold text-lg",
  settingRow: (disabled: boolean) =>
    clsx("flex items-center justify-between gap-5", disabled && "opacity-45 pointer-events-none"),
  settingInfo: "flex flex-col gap-1 flex-1",
  settingLabel: "font-semibold",
  settingDesc: "text-xs text-subtext0",
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
          <dd class={styles.settingDesc}>
            {getMessage("enableOverlayDesc")}
          </dd>
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
          <dd class={styles.settingDesc}>
            {getMessage("startHiddenDesc")}
          </dd>
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
