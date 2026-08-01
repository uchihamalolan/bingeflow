import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";

import * as browserUtils from "@/common/browser";
import { saveSettings } from "@/common/settings";
import { DEFAULT_VIDEO_CONTROLS } from "@/common/video-controls";

import { usePopupSettings } from "../usePopupSettings";

function TestComponent(props: { onHookReady: (hook: any) => void }) {
  const hook = usePopupSettings();
  props.onHookReady(hook);
  return null;
}

describe("usePopupSettings hook", () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  afterEach(() => {
    cleanup();
  });

  it("should initialize settings and calculate enabled status for active tab domain", async () => {
    await saveSettings({
      enabledDomains: ["netflix.com"],
      videoControls: DEFAULT_VIDEO_CONTROLS,
    });

    const tabSpy = vi.spyOn(browserUtils, "getCurrentTab").mockResolvedValue({
      id: 1,
      url: "https://www.netflix.com/watch/123",
    } as any);

    let hookRef: any;
    render(() => (
      <TestComponent
        onHookReady={(h) => {
          hookRef = h;
        }}
      />
    ));

    await new Promise((r) => setTimeout(r, 50));

    expect(hookRef.settings()).not.toBeNull();
    expect(hookRef.currentDomain()).toBe("netflix.com");
    expect(hookRef.isEnabled()).toBe(true);

    await hookRef.toggleEnabled(false);
    expect(hookRef.isEnabled()).toBe(false);

    tabSpy.mockRestore();
  });
});
