import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_VIDEO_CONTROLS } from "@/common/video-controls";

import GamepadShortcuts from "../GamepadShortcuts";

describe("GamepadShortcuts component", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render gamepad bindings list", () => {
    const res = render(() => (
      <GamepadShortcuts videoControls={DEFAULT_VIDEO_CONTROLS} onchange={vi.fn()} />
    ));

    expect(res.getByText("D-Pad Left")).toBeDefined();
    expect(res.getByText("D-Pad Right")).toBeDefined();
  });
});
