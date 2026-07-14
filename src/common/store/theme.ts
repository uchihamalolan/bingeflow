import { createSignal } from "solid-js";

import { getLocalStorage, setLocalStorage } from "@/common/browser";

type Theme = "frappe" | "latte";

const [current, setCurrent] = createSignal<Theme>("frappe");
const THEME_KEY = "bingeflow.theme";

export const theme = {
  get current() {
    return current();
  },
  async init() {
    const stored = await getLocalStorage<Theme>(THEME_KEY);
    const newTheme = stored === "latte" ? "latte" : "frappe";
    setCurrent(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  },
  async toggle() {
    const newTheme = current() === "frappe" ? "latte" : "frappe";
    setCurrent(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    await setLocalStorage(THEME_KEY, newTheme);
  },
};
