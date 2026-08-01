import { cleanup, render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_VIDEO_CONTROLS } from "@/common/video-controls";

import VideoControls from "../VideoControls";

describe("VideoControls component", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render video controls settings and handle toggles", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const res = render(() => (
      <VideoControls videoControls={DEFAULT_VIDEO_CONTROLS} onchange={handleChange} />
    ));

    const toggles = res.getAllByRole<HTMLInputElement>("checkbox");
    expect(toggles.length).toBeGreaterThan(0);

    await user.click(toggles[0]);
    expect(handleChange).toHaveBeenCalled();
  });
});
