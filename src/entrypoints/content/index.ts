import { defineContentScript } from "wxt/utils/define-content-script";

import { detectConfig, getPlatformShortcuts } from "@/common/platforms";
import { loadSettings } from "@/common/settings";

import { addEventListeners } from "./add-listeners";
import { VideoManager } from "./video/video-manager";

export default defineContentScript({
  matches: ["https://*/*"],
  async main() {
    const settings = await loadSettings();
    const platformConfig = detectConfig(window.location.hostname);
    const { videoControls } = settings;

    const videoManager = new VideoManager(videoControls, platformConfig);

    // Pre-compute active platform shortcuts to handle conflicts
    const platformShortcuts = getPlatformShortcuts(platformConfig);

    addEventListeners({
      videoManager,
      platformConfig,
      videoControls,
      platformShortcuts,
    });
  },
});
