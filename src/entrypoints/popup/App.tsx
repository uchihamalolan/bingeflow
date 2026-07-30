import { createSignal, onMount, Show } from "solid-js";

import { getMessage, openOptionsPage } from "@/common/browser";
import { loadSettings, saveSettings, type Settings } from "@/common/settings";
import { theme } from "@/common/store/theme";
import { cx } from "@/common/utils/cx";

import EnableSwitch from "./components/EnableSwitch";
import Header from "./components/Header";
import ShortcutList from "./components/ShortcutList";

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
  const [settings, setSettings] = createSignal<Settings | null>(null);

  onMount(async () => {
    await theme.init();
    const loaded = await loadSettings();
    setSettings(loaded);
  });

  const toggleEnabled = async (checked: boolean) => {
    const current = settings();
    if (!current) return;

    const updated = {
      ...current,
      videoControls: {
        ...current.videoControls,
        enabled: checked,
      },
    };
    setSettings(updated);
    await saveSettings(updated);
  };

  return (
    <div class={styles.popup}>
      <Header />

      <Show when={settings()}>
        {(currentSettings) => (
          <main class={styles.content}>
            <EnableSwitch
              enabled={currentSettings().videoControls.enabled}
              onchange={toggleEnabled}
            />

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
