import { cleanup, render } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import KbdButton from "../KbdButton";

describe("KbdButton component", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render key value when inactive", () => {
    const res = render(() => <KbdButton active={false} value="Z" onclick={vi.fn()} />);
    expect(res.getByText("Z")).toBeDefined();
  });

  it("should trigger click handler when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    const res = render(() => <KbdButton active={false} value="Z" onclick={handleClick} />);
    const button = res.getByRole("button");

    await user.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
});
