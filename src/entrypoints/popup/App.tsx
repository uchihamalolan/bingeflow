import { createSignal, onMount, Show } from "solid-js";

import { openOptionsPage } from "@/common/browser";
import { loadSettings, saveSettings, type Settings } from "@/common/settings";
import { theme } from "@/common/store/theme";

import EnableSwitch from "./components/EnableSwitch";
import Header from "./components/Header";
import ShortcutList from "./components/ShortcutList";

import "virtual:uno.css";

const styles = {
  popup: "overflow-hidden rounded-xl bg-crust text-text",
  content: "p-4 flex flex-col gap-4",
  linkBtn: "bg-transparent border-none text-xs text-mauve hover:underline cursor-pointer p-0",
  footer: "px-4 pb-4 text-center",
  separator: "bg-surface0 m-0 h-px border-none",
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
          Open settings to change shortcuts
        </button>
      </footer>
    </div>
  );
}
