import { defu } from "defu";

import { getSyncStorage, setSyncStorage } from "./browser";
import { DEFAULT_VIDEO_CONTROLS, type VideoControlsConfig } from "./video-controls";

export type Settings = {
  videoControls: VideoControlsConfig;
  enabledDomains: string[];
};

export const DEFAULT_ENABLED_DOMAINS = [
  "netflix.com",
  "hotstar.com",
  "primevideo.com",
  "youtube.com",
];

const STORAGE_KEY = "bingeflow.settings";

export async function loadSettings(): Promise<Settings> {
  const raw = await getSyncStorage<Partial<Settings>>(STORAGE_KEY);

  return {
    videoControls: defu(raw?.videoControls, DEFAULT_VIDEO_CONTROLS),
    enabledDomains: Array.isArray(raw?.enabledDomains)
      ? raw.enabledDomains
      : DEFAULT_ENABLED_DOMAINS,
  };
}

export async function saveSettings(s: Settings): Promise<void> {
  await setSyncStorage(STORAGE_KEY, s);
}
