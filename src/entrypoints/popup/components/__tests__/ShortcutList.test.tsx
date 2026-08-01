import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";

import { DEFAULT_VIDEO_CONTROLS } from "@/common/video-controls";

import ShortcutList from "../ShortcutList";

describe("ShortcutList component", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render keyboard shortcut key badges", () => {
    const res = render(() => <ShortcutList videoControls={DEFAULT_VIDEO_CONTROLS} />);
    expect(res.getByText("Z")).toBeDefined();
    expect(res.getByText("X")).toBeDefined();
    expect(res.getByText("Q")).toBeDefined();
    expect(res.getByText("W")).toBeDefined();
  });
});
