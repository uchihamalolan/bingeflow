import { createSignal, onMount, Show } from "solid-js";

import Toast from "@/common/components/Toast";
import { saveSettings } from "@/common/settings";
import { theme } from "@/common/store/theme";
import type { VideoControlsConfig } from "@/common/video-controls";

import Header from "./components/Header";
import KeyboardShortcuts from "./components/KeyboardShortcuts";
import LoadingState from "./components/LoadingState";
import VideoControls from "./components/VideoControls";
import { settings } from "./store/settings";

import 'virtual:uno.css';

const styles = {
  container: "w-full flex flex-col gap-6",
  mainContent: "grid grid-cols-1 gap-6 items-start md:grid-cols-2",
};

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
          <Toast saveStatus={saveStatus()} />
        </div>
      )}
    </Show>
  );
}
