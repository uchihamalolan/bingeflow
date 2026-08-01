import { cleanup, render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import NumberInput from "../NumberInput";

describe("NumberInput component", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render input with default value 0", () => {
    const res = render(() => <NumberInput />);
    const input = res.getByRole<HTMLInputElement>("spinbutton");
    expect(input.value).toBe("0");
  });

  it("should render custom value, min, max, step, and disabled props", () => {
    const res = render(() => <NumberInput value={10} min={1} max={20} step={2} disabled={true} />);
    const input = res.getByRole<HTMLInputElement>("spinbutton");
    expect(input.value).toBe("10");
    expect(input.min).toBe("1");
    expect(input.max).toBe("20");
    expect(input.step).toBe("2");
    expect(input.disabled).toBe(true);
  });

  it("should render unit text when provided", () => {
    const res = render(() => <NumberInput value={5} unit="sec" />);
    expect(res.getByText("sec")).toBeDefined();
  });

  it("should call onchange handler with numeric value when user types", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const res = render(() => <NumberInput value={5} onchange={handleChange} />);
    const input = res.getByRole("spinbutton");

    await user.clear(input);
    await user.type(input, "15");
    expect(handleChange).toHaveBeenCalledWith(15);
  });
});
