import { describe, expect, it } from "vitest";

import { getTopLevelDomain, isDomainEnabled } from "../domain";

describe("domain utils", () => {
  describe("getTopLevelDomain", () => {
    it("should return empty string for empty hostname", () => {
      expect(getTopLevelDomain("")).toBe("");
    });

    it("should return clean hostname when parts length is 2 or less", () => {
      expect(getTopLevelDomain("netflix.com")).toBe("netflix.com");
      expect(getTopLevelDomain("localhost")).toBe("localhost");
    });

    it("should strip www prefix", () => {
      expect(getTopLevelDomain("www.netflix.com")).toBe("netflix.com");
      expect(getTopLevelDomain("WWW.HOTSTAR.COM")).toBe("hotstar.com");
    });

    it("should extract top level domain from subdomain", () => {
      expect(getTopLevelDomain("watch.netflix.com")).toBe("netflix.com");
      expect(getTopLevelDomain("app.primevideo.com")).toBe("primevideo.com");
    });

    it("should handle second level domains (e.g. co.uk, com.au)", () => {
      expect(getTopLevelDomain("www.amazon.co.uk")).toBe("amazon.co.uk");
      expect(getTopLevelDomain("sub.domain.com.au")).toBe("domain.com.au");
    });
  });

  describe("isDomainEnabled", () => {
    const enabledList = ["netflix.com", "primevideo.com", "amazon.co.uk"];

    it("should return false for empty hostname", () => {
      expect(isDomainEnabled("", enabledList)).toBe(false);
    });

    it("should return true when domain is present in enabled list", () => {
      expect(isDomainEnabled("netflix.com", enabledList)).toBe(true);
      expect(isDomainEnabled("www.netflix.com", enabledList)).toBe(true);
      expect(isDomainEnabled("watch.netflix.com", enabledList)).toBe(true);
      expect(isDomainEnabled("www.amazon.co.uk", enabledList)).toBe(true);
    });

    it("should return false when domain is not in enabled list", () => {
      expect(isDomainEnabled("youtube.com", enabledList)).toBe(false);
      expect(isDomainEnabled("hulu.com", enabledList)).toBe(false);
    });

    it("should handle case insensitivity", () => {
      expect(isDomainEnabled("NETFLIX.COM", enabledList)).toBe(true);
      expect(isDomainEnabled("watch.Netflix.Com", enabledList)).toBe(true);
    });
  });
});
