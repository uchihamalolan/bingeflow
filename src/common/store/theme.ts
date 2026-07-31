import { createSignal } from "solid-js";

import { getLocalStorage, setLocalStorage } from "@/common/browser";

export type Theme = "frappe" | "latte" | "system";

const [current, setCurrent] = createSignal<Theme>("system");
const THEME_KEY = "bingeflow.theme";
let mediaQuery: MediaQueryList | null = null;

function handleSystemThemeChange(e: MediaQueryListEvent | MediaQueryList) {
  if (current() === "system") {
    const systemTheme = e.matches ? "frappe" : "latte";
    document.documentElement.setAttribute("data-theme", systemTheme);
  }
}

export const theme = {
  get current() {
    return current();
  },
  async init() {
    if (typeof window !== "undefined") {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    }

    const stored = await getLocalStorage<Theme>(THEME_KEY);
    const newTheme: Theme = stored ?? "system";

    setCurrent(newTheme);
    this.apply(newTheme);
  },
  apply(newTheme: Theme) {
    if (newTheme === "system" && mediaQuery) {
      const systemTheme = mediaQuery.matches ? "frappe" : "latte";
      document.documentElement.setAttribute("data-theme", systemTheme);
    } else {
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  },
  set(newTheme: Theme) {
    setCurrent(newTheme);
    this.apply(newTheme);
    void setLocalStorage(THEME_KEY, newTheme);
  },
  toggle() {
    let nextTheme: Theme = "system";

    if (current() === "system") {
      nextTheme = "latte";
    } else if (current() === "latte") {
      nextTheme = "frappe";
    } else {
      nextTheme = "system";
    }

    this.set(nextTheme);
  },
};
