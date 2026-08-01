import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";

import { settings } from "../../store/settings";
import { useSettingsSave } from "../useSettingsSave";

function TestComponent(props: { onHookReady: (hook: any) => void }) {
  const hook = useSettingsSave();
  props.onHookReady(hook);
  return null;
}

describe("useSettingsSave hook", () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  afterEach(() => {
    cleanup();
  });

  it("should update video controls and trigger save status", async () => {
    await settings.init();

    let hookRef: any;
    render(() => (
      <TestComponent
        onHookReady={(h) => {
          hookRef = h;
        }}
      />
    ));

    expect(hookRef.saveStatus()).toBe("idle");

    hookRef.handleVideoControlsChange((controls: any) => {
      controls.seekSeconds = 12;
    });

    await new Promise((r) => setTimeout(r, 50));

    expect(settings.current?.videoControls.seekSeconds).toBe(12);
    expect(hookRef.saveStatus()).toBe("success");
  });
});
