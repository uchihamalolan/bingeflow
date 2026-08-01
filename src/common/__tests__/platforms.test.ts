import { describe, expect, it } from "vitest";

import { PLATFORMS, detectConfig, getPlatformBehaviors, getPlatformShortcuts } from "../platforms";

describe("platforms utils", () => {
  describe("detectConfig", () => {
    it("should detect netflix configuration", () => {
      const config = detectConfig("netflix.com");
      expect(config).not.toBeNull();
      expect(config?.platform).toBe("netflix");
      expect(config?.label).toBe("Netflix");
    });

    it("should detect amazon prime video configuration", () => {
      const config = detectConfig("www.primevideo.com");
      expect(config).not.toBeNull();
      expect(config?.platform).toBe("amazon_prime");
    });

    it("should detect hotstar configuration", () => {
      const config = detectConfig("hotstar.com");
      expect(config).not.toBeNull();
      expect(config?.platform).toBe("hotstar");
    });

    it("should return null for unsupported hostnames", () => {
      expect(detectConfig("youtube.com")).toBeNull();
      expect(detectConfig("example.com")).toBeNull();
    });
  });

  describe("getPlatformBehaviors", () => {
    it("should return behavior overrides for amazon prime", () => {
      const behaviors = getPlatformBehaviors(PLATFORMS.amazon_prime);
      expect(behaviors.length).toBeGreaterThan(0);
      const skipBehavior = behaviors.find((b) => b.type === "skip");
      expect(skipBehavior).toBeDefined();
      expect(skipBehavior?.selector).toContain("atvwebplayersdk-skipelement-button");
    });

    it("should return empty list when platform defines no behavior overrides", () => {
      const behaviors = getPlatformBehaviors(PLATFORMS.netflix);
      expect(behaviors).toEqual([]);
    });
  });

  describe("getPlatformShortcuts", () => {
    it("should return empty Set when config is null", () => {
      expect(getPlatformShortcuts(null)).toEqual(new Set());
    });

    it("should return shortcuts for enabled platform behaviors", () => {
      const shortcuts = getPlatformShortcuts(PLATFORMS.amazon_prime);
      expect(shortcuts.has("s")).toBe(true);
      expect(shortcuts.has("n")).toBe(true);
    });
  });
});
