import { beforeEach, describe, expect, it } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";

import { DEFAULT_VIDEO_CONTROLS } from "@/common/video-controls";

import { VideoManager } from "../video-manager";

describe("VideoManager", () => {
  beforeEach(() => {
    fakeBrowser.reset();
    document.body.innerHTML = "";
  });

  it("should initialize and scan for video element in document", () => {
    const video = document.createElement("video");
    video.getBoundingClientRect = () => ({ width: 200, height: 200 }) as DOMRect;
    document.body.appendChild(video);

    const manager = new VideoManager(DEFAULT_VIDEO_CONTROLS, null);
    expect(manager.getVideo()).toBe(video);
    expect(manager.getController()).not.toBeNull();

    manager.destroy();
  });

  it("should unmount overlay when disabled in config update", () => {
    const video = document.createElement("video");
    video.getBoundingClientRect = () => ({ width: 200, height: 200 }) as DOMRect;
    document.body.appendChild(video);

    const manager = new VideoManager(DEFAULT_VIDEO_CONTROLS, null);
    expect(manager.getVideo()).toBe(video);

    manager.updateConfig({
      ...DEFAULT_VIDEO_CONTROLS,
      enabled: false,
    });

    expect(manager.getVideo()).toBeNull();
    expect(manager.getController()).toBeNull();

    manager.destroy();
  });
});
