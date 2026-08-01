import { cleanup, render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import Switch from "../Switch";

describe("Switch component", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render checkbox input with correct attributes", () => {
    const res = render(() => <Switch id="test-switch" ariaLabel="Enable Feature" checked={true} />);

    const input = res.getByRole<HTMLInputElement>("checkbox");
    expect(input.id).toBe("test-switch");
    expect(input.checked).toBe(true);
    expect(res.getByText("Enable Feature")).toBeDefined();
  });

  it("should handle disabled state", () => {
    const res = render(() => (
      <Switch id="disabled-switch" ariaLabel="Disabled Switch" disabled={true} />
    ));

    const input = res.getByRole<HTMLInputElement>("checkbox");
    expect(input.disabled).toBe(true);
  });

  it("should trigger onchange callback when clicked by user", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const res = render(() => (
      <Switch id="toggle-switch" ariaLabel="Toggle" checked={false} onchange={handleChange} />
    ));

    const input = res.getByRole("checkbox");
    await user.click(input);

    expect(handleChange).toHaveBeenCalledWith(true);
  });
});
