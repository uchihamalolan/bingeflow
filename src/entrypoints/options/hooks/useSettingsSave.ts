import { createSignal } from "solid-js";

import { saveSettings } from "@/common/settings";
import type { VideoControlsConfig } from "@/common/video-controls";

import { settings } from "../store/settings";

export function useSettingsSave() {
  const [saveStatus, setSaveStatus] = createSignal<"idle" | "success" | "error">("idle");

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

  return {
    saveStatus,
    handleVideoControlsChange,
  };
}
