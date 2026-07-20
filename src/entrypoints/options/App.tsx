import { createSignal, onMount, Show } from "solid-js";

import { getMessage } from "@/common/browser";
import Toast from "@/common/components/Toast";
import { saveSettings } from "@/common/settings";
import { theme } from "@/common/store/theme";
import type { VideoControlsConfig } from "@/common/video-controls";

import Header from "./components/Header";
import KeyboardShortcuts from "./components/KeyboardShortcuts";
import LoadingState from "./components/LoadingState";
import VideoControls from "./components/VideoControls";
import { settings } from "./store/settings";

import "virtual:uno.css";

const styles = {
  container: "w-full p-12 flex flex-col gap-6",
  mainContent: "grid grid-cols-1 gap-6 items-start md:grid-cols-2",
  footer: "flex items-center justify-center gap-3 text-xs text-subtext0 mt-8",
  link: "hover:underline text-mauve",
};

const rateUrl = import.meta.env.FIREFOX
  ? "https://addons.mozilla.org/firefox/addon/bingeflow/"
  : "https://chromewebstore.google.com/detail/bingeflow-placeholder";

export default function App() {
  const [saveStatus, setSaveStatus] = createSignal<"idle" | "success" | "error">("idle");

  onMount(async () => {
    await Promise.all([theme.init(), settings.init()]);
  });

  const triggerSave = async () => {
    if (!settings.current) return;

    try {
      const clone = JSON.parse(JSON.stringify(settings.current));
      await saveSettings(clone);
      setSaveStatus("success");
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveStatus("error");
    }

    setTimeout(() => {
      setSaveStatus("idle");
    }, 2000);
  };

  const handleVideoControlsChange = (updater: (controls: VideoControlsConfig) => void) => {
    settings.update((s) => {
      updater(s.videoControls);
    });
    void triggerSave();
  };

  return (
    <Show when={settings.current} fallback={<LoadingState />}>
      {(s) => (
        <div class={styles.container}>
          <Header />

          <main class={styles.mainContent}>
            <VideoControls videoControls={s().videoControls} onchange={handleVideoControlsChange} />
            <KeyboardShortcuts
              videoControls={s().videoControls}
              onchange={handleVideoControlsChange}
            />
          </main>
          <footer class={styles.footer}>
            <a
              href="https://codeberg.org/ma101an/bingeflow"
              target="_blank"
              rel="noreferrer"
              class={styles.link}
            >
              {getMessage("optionsHomepage")}
            </a>
            <span class="text-surface2">|</span>
            <a href={rateUrl} target="_blank" rel="noreferrer" class={styles.link}>
              {getMessage("optionsRate")}
            </a>
          </footer>
          <Toast saveStatus={saveStatus()} />
        </div>
      )}
    </Show>
  );
}
