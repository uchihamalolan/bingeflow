import { defu } from "defu";

import { getSyncStorage, setSyncStorage } from "./browser";
import { DEFAULT_VIDEO_CONTROLS, type VideoControlsConfig } from "./video-controls";

export type Settings = {
  videoControls: VideoControlsConfig;
  // Future: per-platform behavior enable/disable overrides go here
};

const STORAGE_KEY = "bingeflow.settings";

export async function loadSettings(): Promise<Settings> {
  const raw = await getSyncStorage<Partial<Settings>>(STORAGE_KEY);

  return defu(raw, {
    videoControls: DEFAULT_VIDEO_CONTROLS,
  });
}

export async function saveSettings(s: Settings): Promise<void> {
  await setSyncStorage(STORAGE_KEY, s);
}
