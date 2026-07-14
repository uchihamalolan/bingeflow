import { Show } from "solid-js";

import { theme } from "@/common/store/theme";

const styles = {
  themeToggle:
    "bg-surface0 border border-surface1 text-text w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:bg-surface1 hover:border-surface2",
  icon: "w-5 h-5",
};

export default function ThemeToggle() {
  return (
    <button
      class={styles.themeToggle}
      type="button"
      onClick={() => theme.toggle()}
      aria-label={theme.current === "frappe" ? "Switch to light theme" : "Switch to dark theme"}
    >
      <Show
        when={theme.current === "frappe"}
        fallback={<span class={`${styles.icon} i-lucide:sun`} aria-hidden="true" />}
      >
        <span class={`${styles.icon} i-lucide:moon`} aria-hidden="true" />
      </Show>
    </button>
  );
}
