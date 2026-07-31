import { Show } from "solid-js";

import { getMessage, openOptionsPage } from "@/common/browser";
import { loadSettings, saveSettings, type Settings } from "@/common/settings";
import { theme } from "@/common/store/theme";
import { cx } from "@/common/utils/cx";

import EnableSwitch from "./components/EnableSwitch";
import Header from "./components/Header";
import ShortcutList from "./components/ShortcutList";
import { usePopupSettings } from "./hooks/usePopupSettings";

import "virtual:uno.css";

const styles = {
  popup: cx({
    colors: "bg-crust text-text",
    borders: "overflow-hidden rounded-xl",
  }),
  content: cx({
    layout: "flex flex-col gap-4",
    spacing: "p-4",
  }),
  linkBtn: cx({
    colors: "bg-transparent text-mauve hover:underline",
    borders: "border-none",
    typography: "text-xs",
    spacing: "p-0",
    state: "cursor-pointer",
  }),
  footer: cx({
    spacing: "px-4 pb-4",
    typography: "text-center",
  }),
  separator: cx({
    colors: "bg-surface0",
    sizing: "h-px",
  }),
};

export default function App() {
  const { settings, isEnabled, toggleEnabled } = usePopupSettings();

  return (
    <div class={styles.popup}>
      <Header />

      <Show when={settings()}>
        {(currentSettings) => (
          <main class={styles.content}>
            <EnableSwitch enabled={isEnabled()} onchange={toggleEnabled} />

            <hr class={styles.separator} />

            <ShortcutList videoControls={currentSettings().videoControls} />
          </main>
        )}
      </Show>

      <footer class={styles.footer}>
        <button onClick={openOptionsPage} class={styles.linkBtn} type="button">
          {getMessage("openSettingsLink")}
        </button>
      </footer>
    </div>
  );
}
