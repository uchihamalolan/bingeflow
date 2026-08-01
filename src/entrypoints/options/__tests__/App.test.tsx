import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";

import { saveSettings } from "@/common/settings";
import { DEFAULT_VIDEO_CONTROLS } from "@/common/video-controls";

import App from "../App";

describe("Options App component", () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render loading state initially and then render full options page", async () => {
    await saveSettings({
      enabledDomains: ["netflix.com"],
      videoControls: DEFAULT_VIDEO_CONTROLS,
    });

    const res = render(() => <App />);

    await new Promise((r) => setTimeout(r, 40));

    expect(res.getByText("BingeFlow")).toBeDefined();
    expect(res.getByText("Enabled Websites")).toBeDefined();
  });
});
