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
    expect(manager.hasActiveVideo()).toBe(true);

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
    expect(manager.hasActiveVideo()).toBe(false);

    manager.destroy();
  });

  it("should execute video commands when video is active", () => {
    const video = document.createElement("video");
    Object.defineProperty(video, "duration", { value: 100, writable: true });
    Object.defineProperty(video, "currentTime", { value: 0, writable: true });
    video.getBoundingClientRect = () => ({ width: 200, height: 200 }) as DOMRect;
    document.body.appendChild(video);

    const manager = new VideoManager(DEFAULT_VIDEO_CONTROLS, null);
    manager.execute("seekFwd");
    expect(video.currentTime).toBe(5);

    manager.destroy();
  });
});
