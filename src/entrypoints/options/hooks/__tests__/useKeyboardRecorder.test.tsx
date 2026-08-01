import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useKeyboardRecorder } from "../useKeyboardRecorder";

function TestComponent(props: { onchange: any; onHookReady?: (hook: any) => void }) {
  const hook = useKeyboardRecorder({ onchange: props.onchange });
  props.onHookReady?.(hook);
  return null;
}

describe("useKeyboardRecorder hook", () => {
  afterEach(() => {
    cleanup();
  });

  it("should record pressed key and clear active rebind state", () => {
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

    hookRef.setActiveRebindKey("seekBack");
    expect(hookRef.activeRebindKey()).toBe("seekBack");

    const event = new KeyboardEvent("keydown", { key: "a", bubbles: true });
    window.dispatchEvent(event);

    expect(handleChange).toHaveBeenCalled();
    expect(hookRef.activeRebindKey()).toBeNull();
  });

  it("should cancel active rebind state on Escape key", () => {
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

    hookRef.setActiveRebindKey("seekBack");
    const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true });
    window.dispatchEvent(event);

    expect(handleChange).not.toHaveBeenCalled();
    expect(hookRef.activeRebindKey()).toBeNull();
  });
});
