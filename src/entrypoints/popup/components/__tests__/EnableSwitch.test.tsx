import { cleanup, render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import EnableSwitch from "../EnableSwitch";

describe("EnableSwitch component", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render switch with label and handle toggle", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const res = render(() => <EnableSwitch enabled={true} onchange={handleChange} />);
    const checkbox = res.getByRole<HTMLInputElement>("checkbox");

    expect(checkbox.checked).toBe(true);

    await user.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });
});
