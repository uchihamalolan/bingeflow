import { beforeEach, describe, expect, it } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";

import { DEFAULT_ENABLED_DOMAINS, loadSettings, saveSettings, type Settings } from "../settings";
import { DEFAULT_VIDEO_CONTROLS } from "../video-controls";

describe("settings utils", () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  it("should return default settings when storage is empty", async () => {
    const settings = await loadSettings();
    expect(settings.enabledDomains).toEqual(DEFAULT_ENABLED_DOMAINS);
    expect(settings.videoControls).toEqual(DEFAULT_VIDEO_CONTROLS);
  });

  it("should save and load updated settings", async () => {
    const customSettings: Settings = {
      enabledDomains: ["netflix.com"],
      videoControls: {
        ...DEFAULT_VIDEO_CONTROLS,
        seekSeconds: 10,
      },
    };

    await saveSettings(customSettings);
    const loaded = await loadSettings();

    expect(loaded.enabledDomains).toEqual(["netflix.com"]);
    expect(loaded.videoControls.seekSeconds).toBe(10);
  });

  it("should merge partial videoControls with defaults when loading", async () => {
    const partialSettings = {
      videoControls: {
        seekSeconds: 15,
      },
    } as Settings;

    await saveSettings(partialSettings);
    const loaded = await loadSettings();

    expect(loaded.videoControls.seekSeconds).toBe(15);
    expect(loaded.videoControls.speedStep).toBe(DEFAULT_VIDEO_CONTROLS.speedStep);
    expect(loaded.enabledDomains).toEqual(DEFAULT_ENABLED_DOMAINS);
  });
});
