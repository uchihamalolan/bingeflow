import { beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_GAMEPAD_BINDINGS } from "@/common/video-controls";

import { GamepadListener } from "../gamepad-listener";

describe("GamepadListener", () => {
  let mockDispatcher: any;
  let listener: GamepadListener;

  beforeEach(() => {
    mockDispatcher = { executeCommand: vi.fn() };
    listener = new GamepadListener({
      dispatcher: mockDispatcher,
      getBindings: () => DEFAULT_GAMEPAD_BINDINGS,
    });
  });

  it("should add and remove window gamepad event listeners on start/stop", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    listener.start();
    expect(addSpy).toHaveBeenCalledWith("gamepadconnected", expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith("gamepaddisconnected", expect.any(Function));

    listener.stop();
    expect(removeSpy).toHaveBeenCalledWith("gamepadconnected", expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith("gamepaddisconnected", expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
