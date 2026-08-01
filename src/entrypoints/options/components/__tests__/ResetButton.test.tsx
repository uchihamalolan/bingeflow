import { cleanup, render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import ResetButton from "../ResetButton";

describe("ResetButton component", () => {
  afterEach(() => {
    cleanup();
  });

  it("should trigger click callback when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    const res = render(() => <ResetButton onclick={handleClick} title="Reset Settings" />);
    const button = res.getByRole("button", { name: "Reset Settings" });

    await user.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
});
