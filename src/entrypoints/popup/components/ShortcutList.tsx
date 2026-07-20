import { getMessage } from "@/common/browser";
import type { VideoControlsConfig } from "@/common/video-controls";

interface Props {
  videoControls: VideoControlsConfig;
}

const styles = {
  container: "flex flex-col gap-2",
  title: "text-xs font-semibold text-subtext0 uppercase tracking-wider",
  shortcutList: "flex flex-col gap-2 list-none p-0 m-0",
  shortcutItem: "flex items-center justify-between text-sm",
  kbd: "bg-surface0 border border-surface1 px-2 py-0.5 rounded text-xs font-mono text-text",
};

export default function ShortcutList(props: Props) {
  const bindings = () => props.videoControls.keyBindings;

  return (
    <div class={styles.container}>
      <p class={styles.title}>{getMessage("shortcutsHeader")}</p>
      <ul class={styles.shortcutList}>
        <li class={styles.shortcutItem}>
          <span class="text-subtext0">{getMessage("shortcutToggleOverlay")}</span>
          <kbd class={styles.kbd}>V</kbd>
        </li>
        <li class={styles.shortcutItem}>
          <span class="text-subtext0">{getMessage("shortcutSeekBackward")}</span>
          <kbd class={styles.kbd}>{bindings().seekBack.toUpperCase()}</kbd>
        </li>
        <li class={styles.shortcutItem}>
          <span class="text-subtext0">{getMessage("shortcutSeekForward")}</span>
          <kbd class={styles.kbd}>{bindings().seekFwd.toUpperCase()}</kbd>
        </li>
        <li class={styles.shortcutItem}>
          <span class="text-subtext0">{getMessage("shortcutDecreaseSpeed")}</span>
          <kbd class={styles.kbd}>{bindings().speedDown.toUpperCase()}</kbd>
        </li>
        <li class={styles.shortcutItem}>
          <span class="text-subtext0">{getMessage("shortcutIncreaseSpeed")}</span>
          <kbd class={styles.kbd}>{bindings().speedUp.toUpperCase()}</kbd>
        </li>
        <li class={styles.shortcutItem}>
          <span class="text-subtext0">{getMessage("shortcutResetSpeed")}</span>
          <kbd class={styles.kbd}>{bindings().resetSpeed.toUpperCase()}</kbd>
        </li>
      </ul>
    </div>
  );
}
