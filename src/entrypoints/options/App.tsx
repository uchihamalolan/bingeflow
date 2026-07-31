import { onMount, Show } from "solid-js";

import { getMessage } from "@/common/browser";
import Toast from "@/common/components/Toast";
import { theme } from "@/common/store/theme";
import { cx } from "@/common/utils/cx";

import EnabledSites from "./components/EnabledSites";
import GamepadShortcuts from "./components/GamepadShortcuts";
import Header from "./components/Header";
import KeyboardShortcuts from "./components/KeyboardShortcuts";
import LoadingState from "./components/LoadingState";
import VideoControls from "./components/VideoControls";
import { useSettingsSave } from "./hooks/useSettingsSave";
import { settings } from "./store/settings";

import "virtual:uno.css";

const styles = {
  container: "flex flex-col gap-6 p-12",
  mainContent: "columns-1 md:columns-2 gap-6 [&>*]:mb-6 [&>*]:break-inside-avoid",
  footer: cx({
    preset: "text-muted flex-center",
    layout: "gap-3",
    spacing: "mt-8",
  }),
  link: "btn-link",
  divider: "text-surface2",
};

const rateUrl = import.meta.env.FIREFOX
  ? "https://addons.mozilla.org/firefox/addon/bingeflow/"
  : "https://chromewebstore.google.com/detail/bingeflow-placeholder";

export default function App() {
  const { saveStatus, handleVideoControlsChange } = useSettingsSave();

  onMount(async () => {
    await Promise.all([theme.init(), settings.init()]);
  });

  return (
    <Show when={settings.current} fallback={<LoadingState />}>
      {(s) => (
        <div class={styles.container}>
          <Header />

          <main class={styles.mainContent}>
            <VideoControls videoControls={s().videoControls} onchange={handleVideoControlsChange} />
            <EnabledSites enabledDomains={s().enabledDomains} />
            <KeyboardShortcuts
              videoControls={s().videoControls}
              onchange={handleVideoControlsChange}
            />
            <GamepadShortcuts
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
            <span class={styles.divider}>|</span>
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
