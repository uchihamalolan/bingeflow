import { Show } from "solid-js";

import { getMessage } from "@/common/browser";
import { theme } from "@/common/store/theme";

interface Props {
  class?: string;
}

const getThemeLabel = (t: string) => {
  if (t === "system") return getMessage("themeSystem");
  if (t === "frappe") return getMessage("themeFrappe");
  if (t === "latte") return getMessage("themeLatte");
  return t;
};

export default function ThemeToggle(props: Props) {
  return (
    <button
      class={props.class}
      type="button"
      onClick={() => theme.toggle()}
      aria-label={getMessage("themeToggleLabel", getThemeLabel(theme.current))}
      title={getMessage("themeToggleLabel", getThemeLabel(theme.current))}
    >
      <Show when={theme.current === "system"}>
        <span class="i-lucide:monitor h-5 w-5" aria-hidden="true" />
      </Show>
      <Show when={theme.current === "frappe"}>
        <span class="i-lucide:moon h-5 w-5" aria-hidden="true" />
      </Show>
      <Show when={theme.current === "latte"}>
        <span class="i-lucide:sun h-5 w-5" aria-hidden="true" />
      </Show>
    </button>
  );
}
