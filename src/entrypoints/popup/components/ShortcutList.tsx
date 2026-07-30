import { getMessage } from "@/common/browser";
import { cx } from "@/common/utils/cx";
import type { VideoControlsConfig } from "@/common/video-controls";

interface Props {
  videoControls: VideoControlsConfig;
}

const styles = {
  container: cx({
    layout: "flex flex-col gap-2",
  }),
  title: cx({
    typography: "text-xs font-semibold text-subtext0 uppercase tracking-wider",
  }),
  shortcutList: cx({
    layout: "flex flex-col gap-2 list-none",
    spacing: "p-0 m-0",
  }),
  shortcutItem: cx({
    layout: "flex items-center justify-between",
    typography: "text-sm",
  }),
  kbd: cx({
    colors: "bg-surface0 text-text",
    borders: "border border-surface1 rounded",
    spacing: "px-2 py-0.5",
    typography: "text-xs font-mono",
  }),
};

export default function ShortcutList(props: Props) {
  const bindings = () => props.videoControls.keyBindings;

  return (
    <div class={styles.container}>
      <p class={styles.title}>{getMessage("shortcutsHeader")}</p>
      <ul class={styles.shortcutList}>
        <li class={styles.shortcutItem}>
          <span class="text-subtext0">{getMessage("shortcutToggleOverlay")}</span>
          <kbd class={styles.kbd}>{bindings().toggleOverlay ? bindings().toggleOverlay.toUpperCase() : "V"}</kbd>
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
