import { cleanup, render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";

import { saveSettings } from "@/common/settings";
import { DEFAULT_VIDEO_CONTROLS } from "@/common/video-controls";

import App from "../App";

describe("Popup App component", () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render popup interface once settings are loaded", async () => {
    await saveSettings({
      enabledDomains: ["netflix.com"],
      videoControls: DEFAULT_VIDEO_CONTROLS,
    });

    const user = userEvent.setup();
    const spy = vi.spyOn(fakeBrowser.runtime, "openOptionsPage");
    const res = render(() => <App />);

    await new Promise((r) => setTimeout(r, 40));

    const openSettingsBtn = res.getByRole("button", { name: /openSettingsLink/i });
    expect(openSettingsBtn).toBeDefined();

    await user.click(openSettingsBtn);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
