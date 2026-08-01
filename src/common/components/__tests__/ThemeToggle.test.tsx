import { cleanup, render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";

import { theme } from "@/common/store/theme";

import ThemeToggle from "../ThemeToggle";

describe("ThemeToggle component", () => {
  beforeEach(() => {
    fakeBrowser.reset();
    theme.set("system");
  });

  afterEach(() => {
    cleanup();
  });

  it("should render button with system theme state", () => {
    const res = render(() => <ThemeToggle />);
    const button = res.getByRole("button");

    expect(button).toBeDefined();
    expect(theme.current).toBe("system");
  });

  it("should toggle theme when user clicks button", async () => {
    const user = userEvent.setup();
    const res = render(() => <ThemeToggle />);
    const button = res.getByRole("button");

    expect(theme.current).toBe("system");
    await user.click(button);
    expect(theme.current).toBe("latte");

    await user.click(button);
    expect(theme.current).toBe("frappe");
  });
});
