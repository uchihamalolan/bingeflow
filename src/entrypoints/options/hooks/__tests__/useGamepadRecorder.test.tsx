import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useGamepadRecorder } from "../useGamepadRecorder";

function TestComponent(props: { onchange: any; onHookReady?: (hook: any) => void }) {
  const hook = useGamepadRecorder({ onchange: props.onchange });
  props.onHookReady?.(hook);
  return null;
}

describe("useGamepadRecorder hook", () => {
  afterEach(() => {
    cleanup();
  });

  it("should initialize with null active key and clear on Escape", () => {
    const handleChange = vi.fn();
    let hookRef: any;

    render(() => (
      <TestComponent
        onchange={handleChange}
        onHookReady={(h) => {
          hookRef = h;
        }}
      />
    ));

    expect(hookRef.activeRebindKey()).toBeNull();

    hookRef.setActiveRebindKey("seekBack");
    expect(hookRef.activeRebindKey()).toBe("seekBack");

    const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true });
    window.dispatchEvent(event);

    expect(hookRef.activeRebindKey()).toBeNull();
  });
});
