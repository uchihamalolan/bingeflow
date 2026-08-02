import { beforeEach, describe, expect, it, vi } from "vitest";

import type { PlatformManager } from "../../platform/platform-manager";
import type { VideoManager } from "../../video/video-manager";
import { CommandDispatcher } from "../dispatcher";

describe("CommandDispatcher", () => {
  let mockVideoManager: VideoManager;
  let mockPlatformManager: PlatformManager;
  let dispatcher: CommandDispatcher;
  let videoExecuteSpy: ReturnType<typeof vi.fn>;
  let platformExecuteSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    videoExecuteSpy = vi.fn();
    platformExecuteSpy = vi.fn();

    mockVideoManager = {
      execute: videoExecuteSpy,
    } as any;

    mockPlatformManager = {
      execute: platformExecuteSpy,
    } as any;

    dispatcher = new CommandDispatcher({
      videoManager: mockVideoManager,
      platformManager: mockPlatformManager,
    });
  });

  it("should forward video commands to VideoManager", () => {
    dispatcher.executeCommand("seekBack");
    expect(videoExecuteSpy).toHaveBeenCalledWith("seekBack");

    dispatcher.executeCommand("seekFwd");
    expect(videoExecuteSpy).toHaveBeenCalledWith("seekFwd");

    dispatcher.executeCommand("togglePlay");
    expect(videoExecuteSpy).toHaveBeenCalledWith("togglePlay");

    dispatcher.executeCommand("speedUp");
    expect(videoExecuteSpy).toHaveBeenCalledWith("speedUp");

    dispatcher.executeCommand("speedDown");
    expect(videoExecuteSpy).toHaveBeenCalledWith("speedDown");

    dispatcher.executeCommand("resetSpeed");
    expect(videoExecuteSpy).toHaveBeenCalledWith("resetSpeed");

    dispatcher.executeCommand("toggleOverlay");
    expect(videoExecuteSpy).toHaveBeenCalledWith("toggleOverlay");
  });

  it("should forward platform commands (skip, next) to PlatformManager", () => {
    dispatcher.executeCommand("skip");
    expect(platformExecuteSpy).toHaveBeenCalledWith("skip");

    dispatcher.executeCommand("next");
    expect(platformExecuteSpy).toHaveBeenCalledWith("next");
  });
});
