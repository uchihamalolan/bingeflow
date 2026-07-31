import { clsx } from "clsx";
import { For, Show } from "solid-js";

import { cx } from "@/common/utils/cx";

interface Props {
  enabledDomains: string[];
}

const styles = {
  details: cx({
    layout: "flex flex-col gap-5",
    colors: "bg-mantle",
    borders: "border-(~ surface0) rounded-2xl",
    spacing: "p-6",
    typography: "text-text group"
  }),
  summary: cx({
    layout: "flex items-center justify-between gap-3 list-none cursor-pointer select-none",
    colors: "text-mauve hover:text-mauve/80",
  }),
  summaryLeft: cx({
    layout: "flex items-center gap-2",
  }),
  title: cx({
    colors: "text-mauve",
    typography: "font-semibold text-lg",
  }),
  badge: cx({
    colors: "bg-surface0 text-subtext0",
    borders: "rounded-full",
    spacing: "px-2 py-0.5",
    typography: "text-xs font-mono font-medium",
  }),
  chevron: cx({
    layout: clsx("i-lucide:chevron-down", "w-5 h-5"),
    colors: "text-subtext0 transition-transform duration-200 group-open:rotate-180",
  }),
  grid: cx({
    layout: "flex flex-wrap gap-2",
    spacing: "pt-4",
  }),
  domainTag: cx({
    colors: "bg-surface0/70 text-text border-(~ surface1)",
    borders: "rounded-lg",
    spacing: "px-3 py-1.5",
    typography: "text-xs font-mono",
    layout: "flex items-center gap-2",
  }),
  dot: cx({
    colors: "bg-green",
    borders: "rounded-full",
    sizing: "w-2 h-2",
  }),
  emptyState: cx({
    typography: "text-xs text-subtext0 italic",
    spacing: "pt-4",
  }),
};

export default function EnabledSites(props: Props) {
  return (
    <details class={styles.details}>
      <summary class={styles.summary} aria-label="Enabled Websites">
        <div class={styles.summaryLeft}>
          <h2 class={styles.title}>Enabled Websites</h2>
          <span class={styles.badge}>{props.enabledDomains.length}</span>
        </div>
        <span class={styles.chevron} aria-hidden="true" />
      </summary>

      <Show
        when={props.enabledDomains.length > 0}
        fallback={
          <p class={styles.emptyState}>
            No websites enabled. Enable sites using the extension popup UI.
          </p>
        }
      >
        <div class={styles.grid}>
          <For each={props.enabledDomains}>
            {(domain) => (
              <div class={styles.domainTag}>
                <span class={styles.dot} />
                <span>{domain}</span>
              </div>
            )}
          </For>
        </div>
      </Show>
    </details>
  );
}
