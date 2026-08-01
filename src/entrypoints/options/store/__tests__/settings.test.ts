import { beforeEach, describe, expect, it } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";

import { DEFAULT_ENABLED_DOMAINS } from "@/common/settings";

import { settings } from "../settings";

describe("options settings store", () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  it("should initialize store state from storage", async () => {
    await settings.init();
    expect(settings.current).not.toBeNull();
    expect(settings.current?.enabledDomains).toEqual(DEFAULT_ENABLED_DOMAINS);
  });

  it("should update store state using produce function", async () => {
    await settings.init();
    settings.update((s) => {
      s.enabledDomains.push("example.com");
    });
    expect(settings.current?.enabledDomains).toContain("example.com");
  });
});
