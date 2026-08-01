import { beforeEach, describe, expect, it, vi } from "vitest";

import { PLATFORMS } from "@/common/platforms";

import { PlatformManager } from "../platform-manager";

describe("PlatformManager", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should return config or null", () => {
    const manager = new PlatformManager(PLATFORMS.amazon_prime);
    expect(manager.getConfig()?.platform).toBe("amazon_prime");

    const nullManager = new PlatformManager(null);
    expect(nullManager.getConfig()).toBeNull();
  });

  it("should return command for mapped shortcut key", () => {
    const manager = new PlatformManager(PLATFORMS.amazon_prime);
    expect(manager.getCommandForKey("s")).toBe("skip");
    expect(manager.getCommandForKey("n")).toBe("next");
    expect(manager.getCommandForKey("z")).toBeNull();
  });

  it("should click element when executing platform command", () => {
    const manager = new PlatformManager(PLATFORMS.amazon_prime);
    const container = document.createElement("div");
    container.className = "atvwebplayersdk-action-buttons";

    const button = document.createElement("button");
    button.className = "atvwebplayersdk-skipelement-button";

    const clickSpy = vi.spyOn(button, "click");
    container.appendChild(button);
    document.body.appendChild(container);

    manager.execute("skip");
    expect(clickSpy).toHaveBeenCalled();
  });
});
