import { cleanup, render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";

import SettingsButton from "../SettingsButton";

describe("SettingsButton component", () => {
  afterEach(() => {
    cleanup();
    fakeBrowser.reset();
  });

  it("should open options page when button is clicked", async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(fakeBrowser.runtime, "openOptionsPage");
    const res = render(() => <SettingsButton />);
    const button = res.getByRole("button");

    await user.click(button);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
