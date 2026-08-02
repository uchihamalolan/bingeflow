import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_VIDEO_CONTROLS } from "@/common/video-controls";

import { KeyboardListener } from "../keyboard-listener";

describe("KeyboardListener", () => {
  let mockDispatcher: any;
  let mockVideoManager: any;
  let mockPlatformManager: any;
  let listener: KeyboardListener;

  beforeEach(() => {
    document.body.innerHTML = "";
    mockDispatcher = { executeCommand: vi.fn() };
    mockVideoManager = {
      hasActiveVideo: vi.fn().mockReturnValue(true),
      getConfig: vi.fn().mockReturnValue(DEFAULT_VIDEO_CONTROLS),
    };
    mockPlatformManager = {
      getCommandForKey: vi.fn().mockReturnValue(null),
    };

    listener = new KeyboardListener({
      dispatcher: mockDispatcher,
      videoManager: mockVideoManager,
      platformManager: mockPlatformManager,
      platformShortcuts: new Set(["s"]),
    });
  });

  it("should start and stop listening to keydown events", () => {
    listener.start();
    const event = new KeyboardEvent("keydown", { key: "z", bubbles: true });
    document.dispatchEvent(event);
    expect(mockDispatcher.executeCommand).toHaveBeenCalledWith("seekBack");

    mockDispatcher.executeCommand.mockClear();
    listener.stop();
    document.dispatchEvent(event);
    expect(mockDispatcher.executeCommand).not.toHaveBeenCalled();
  });

  it("should ignore events with modifiers or repeat", () => {
    listener.start();
    const ctrlEvent = new KeyboardEvent("keydown", { key: "z", ctrlKey: true, bubbles: true });
    document.dispatchEvent(ctrlEvent);
    expect(mockDispatcher.executeCommand).not.toHaveBeenCalled();

    const repeatEvent = new KeyboardEvent("keydown", { key: "z", repeat: true, bubbles: true });
    document.dispatchEvent(repeatEvent);
    expect(mockDispatcher.executeCommand).not.toHaveBeenCalled();
    listener.stop();
  });

  it("should ignore keydown events inside input or editable elements", () => {
    listener.start();
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    const event = new KeyboardEvent("keydown", { key: "z", bubbles: true });
    input.dispatchEvent(event);
    expect(mockDispatcher.executeCommand).not.toHaveBeenCalled();
    listener.stop();
  });
});
