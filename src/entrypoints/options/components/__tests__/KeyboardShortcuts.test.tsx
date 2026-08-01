import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_VIDEO_CONTROLS } from "@/common/video-controls";

import KeyboardShortcuts from "../KeyboardShortcuts";

describe("KeyboardShortcuts component", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render shortcut key bindings", () => {
    const res = render(() => (
      <KeyboardShortcuts videoControls={DEFAULT_VIDEO_CONTROLS} onchange={vi.fn()} />
    ));

    expect(res.getByText("Z")).toBeDefined();
    expect(res.getByText("X")).toBeDefined();
    expect(res.getByText("Q")).toBeDefined();
  });
});
