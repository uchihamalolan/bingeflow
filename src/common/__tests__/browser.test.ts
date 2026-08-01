import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";

import {
  getLocalStorage,
  getMessage,
  getSyncStorage,
  setLocalStorage,
  setSyncStorage,
} from "../browser";

describe("browser extension API wrappers", () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  describe("sync storage", () => {
    it("should get undefined for unset key", async () => {
      const val = await getSyncStorage<string>("test_key");
      expect(val).toBeUndefined();
    });

    it("should set and get sync storage value", async () => {
      await setSyncStorage("test_key", { foo: "bar" });
      const val = await getSyncStorage<{ foo: string }>("test_key");
      expect(val).toEqual({ foo: "bar" });
    });
  });

  describe("local storage", () => {
    it("should get undefined for unset key", async () => {
      const val = await getLocalStorage<string>("local_key");
      expect(val).toBeUndefined();
    });

    it("should set and get local storage value", async () => {
      await setLocalStorage("local_key", "hello");
      const val = await getLocalStorage<string>("local_key");
      expect(val).toBe("hello");
    });
  });

  describe("getMessage", () => {
    it("should return string version of key when i18n throws or is unimplemented", () => {
      expect(getMessage("extName")).toBe("extName");
    });

    it("should return localized message when i18n returns a string", () => {
      const spy = vi.spyOn(fakeBrowser.i18n, "getMessage").mockReturnValue("Bingeflow Extension");
      expect(getMessage("extName")).toBe("Bingeflow Extension");
      spy.mockRestore();
    });
  });
});
