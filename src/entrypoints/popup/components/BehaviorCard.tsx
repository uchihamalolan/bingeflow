import { clsx } from "clsx";

import type { BehaviorConfig } from "@/common/behaviors";

const styles = {
  card: "grid grid-cols-[auto_auto_1fr] items-center gap-2 bg-surface0 border-(~ surface1) rounded-md my-2 mx-3 p-3",
  title: "m-0 text-base",
  badge: (enabled: boolean) =>
    clsx(
      "text-xs px-2 py-0.5 rounded-full",
      enabled
        ? "bg-[rgba(166,209,137,0.12)] text-green border-(~ [rgba(166,209,137,0.2)])"
        : "bg-[rgba(231,130,132,0.12)] text-red border-(~ [rgba(231,130,132,0.2)])",
    ),
  shortcut: "col-span-full flex justify-between items-center m-0",
  shortcutLabel: "text-subtext0",
  shortcutValue: "m-0",
  kbd: "inline-flex items-center justify-center min-w-7 h-7 px-1.5 text-mauve bg-[rgba(202,158,230,0.1)] border-(~ b-2 [rgba(202,158,230,0.25)]) rounded-sm",
};

interface Props {
  behavior: BehaviorConfig;
}

export default function BehaviorCard(props: Props) {
  return (
    <article class={styles.card}>
      <h3 class={styles.title}>{props.behavior.label}</h3>
      <mark class={styles.badge(props.behavior.enabled)}>
        {props.behavior.enabled ? "Active" : "Inactive"}
      </mark>
      <dl class={styles.shortcut}>
        <dt class={styles.shortcutLabel}>Shortcut Key</dt>
        <dd class={styles.shortcutValue}>
          <kbd class={styles.kbd}>{props.behavior.shortcutKey.toUpperCase()}</kbd>
        </dd>
      </dl>
    </article>
  );
}
