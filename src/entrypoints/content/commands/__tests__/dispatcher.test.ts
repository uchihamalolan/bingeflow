import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_VIDEO_CONTROLS } from "@/common/video-controls";

import type { PlatformManager } from "../../platform/platform-manager";
import type { VideoManager } from "../../video/video-manager";
import { CommandDispatcher } from "../dispatcher";

describe("CommandDispatcher", () => {
  let mockController: any;
  let mockVideoManager: VideoManager;
  let mockPlatformManager: PlatformManager;
  let dispatcher: CommandDispatcher;
  let toggleOverlaySpy: ReturnType<typeof vi.fn>;
  let platformExecuteSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockController = {
      seek: vi.fn(),
      togglePlay: vi.fn(),
      setPlaybackRate: vi.fn(),
      getPlaybackRate: vi.fn().mockReturnValue(1.0),
    };

    toggleOverlaySpy = vi.fn();
    platformExecuteSpy = vi.fn();

    mockVideoManager = {
      getController: vi.fn().mockReturnValue(mockController),
      getConfig: vi.fn().mockReturnValue(DEFAULT_VIDEO_CONTROLS),
      toggleOverlay: toggleOverlaySpy,
      triggerActivity: vi.fn(),
    } as any;

    mockPlatformManager = {
      execute: platformExecuteSpy,
    } as any;

    dispatcher = new CommandDispatcher({
      videoManager: mockVideoManager,
      platformManager: mockPlatformManager,
    });
  });

  it("should execute video commands (seekBack, seekFwd, speedUp, speedDown, resetSpeed, togglePlay, toggleOverlay)", () => {
    dispatcher.executeCommand("seekBack");
    expect(mockController.seek).toHaveBeenCalledWith(-5);

    dispatcher.executeCommand("seekFwd");
    expect(mockController.seek).toHaveBeenCalledWith(5);

    dispatcher.executeCommand("togglePlay");
    expect(mockController.togglePlay).toHaveBeenCalled();

    dispatcher.executeCommand("speedUp");
    expect(mockController.setPlaybackRate).toHaveBeenCalledWith(1.25);

    dispatcher.executeCommand("speedDown");
    expect(mockController.setPlaybackRate).toHaveBeenCalledWith(0.75);

    dispatcher.executeCommand("resetSpeed");
    expect(mockController.setPlaybackRate).toHaveBeenCalledWith(1.0);

    dispatcher.executeCommand("toggleOverlay");
    expect(toggleOverlaySpy).toHaveBeenCalled();
  });

  it("should forward platform commands (skip, next) to PlatformManager", () => {
    dispatcher.executeCommand("skip");
    expect(platformExecuteSpy).toHaveBeenCalledWith("skip");

    dispatcher.executeCommand("next");
    expect(platformExecuteSpy).toHaveBeenCalledWith("next");
  });
});
