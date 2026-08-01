import { getMessage } from "@/common/browser";
import type { VideoControlsConfig } from "@/common/video-controls";

interface Props {
  videoControls: VideoControlsConfig;
}

const styles = {
  container: "flex flex-col gap-2",
  title: "text-xs font-semibold text-subtext0 uppercase tracking-wider",
  shortcutList: "flex flex-col gap-2",
  shortcutItem: "flex items-center justify-between text-sm",
  label: "text-subtext0",
  kbd: "kbd-badge",
};

export default function ShortcutList(props: Props) {
  const bindings = () => props.videoControls.keyBindings;

  return (
    <div class={styles.container}>
      <p class={styles.title}>{getMessage("shortcutsHeader")}</p>
      <ul class={styles.shortcutList}>
        <li class={styles.shortcutItem}>
          <span class={styles.label}>{getMessage("shortcutToggleOverlay")}</span>
          <kbd class={styles.kbd}>
            {bindings().toggleOverlay ? bindings().toggleOverlay.toUpperCase() : "V"}
          </kbd>
        </li>
        <li class={styles.shortcutItem}>
          <span class={styles.label}>{getMessage("shortcutSeekBackward")}</span>
          <kbd class={styles.kbd}>{bindings().seekBack.toUpperCase()}</kbd>
        </li>
        <li class={styles.shortcutItem}>
          <span class={styles.label}>{getMessage("shortcutSeekForward")}</span>
          <kbd class={styles.kbd}>{bindings().seekFwd.toUpperCase()}</kbd>
        </li>
        <li class={styles.shortcutItem}>
          <span class={styles.label}>{getMessage("shortcutDecreaseSpeed")}</span>
          <kbd class={styles.kbd}>{bindings().speedDown.toUpperCase()}</kbd>
        </li>
        <li class={styles.shortcutItem}>
          <span class={styles.label}>{getMessage("shortcutIncreaseSpeed")}</span>
          <kbd class={styles.kbd}>{bindings().speedUp.toUpperCase()}</kbd>
        </li>
        <li class={styles.shortcutItem}>
          <span class={styles.label}>{getMessage("shortcutResetSpeed")}</span>
          <kbd class={styles.kbd}>{bindings().resetSpeed.toUpperCase()}</kbd>
        </li>
      </ul>
    </div>
  );
}
