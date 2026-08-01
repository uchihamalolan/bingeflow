import { beforeEach, describe, expect, it } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";

import { theme } from "../theme";

describe("theme store", () => {
  beforeEach(() => {
    fakeBrowser.reset();
    document.documentElement.removeAttribute("data-theme");
  });

  it("should initialize default theme as system", async () => {
    await theme.init();
    expect(theme.current).toBe("system");
  });

  it("should set new theme and update data-theme attribute on documentElement", () => {
    theme.set("latte");
    expect(theme.current).toBe("latte");
    expect(document.documentElement.getAttribute("data-theme")).toBe("latte");

    theme.set("frappe");
    expect(theme.current).toBe("frappe");
    expect(document.documentElement.getAttribute("data-theme")).toBe("frappe");
  });

  it("should toggle through themes in order: system -> latte -> frappe -> system", () => {
    theme.set("system");
    expect(theme.current).toBe("system");

    theme.toggle();
    expect(theme.current).toBe("latte");

    theme.toggle();
    expect(theme.current).toBe("frappe");

    theme.toggle();
    expect(theme.current).toBe("system");
  });
});
