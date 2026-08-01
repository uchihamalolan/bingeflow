import { Show } from "solid-js";

import { getMessage, openOptionsPage } from "@/common/browser";

import EnableSwitch from "./components/EnableSwitch";
import Header from "./components/Header";
import ShortcutList from "./components/ShortcutList";
import { usePopupSettings } from "./hooks/usePopupSettings";

import "virtual:uno.css";

const styles = {
  popup: "bg-crust text-text overflow-hidden rounded-xl",
  content: "flex flex-col gap-4 p-4",
  linkBtn: "btn-link",
  footer: "px-4 pb-4 text-center",
  separator: "bg-surface0 h-px",
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
