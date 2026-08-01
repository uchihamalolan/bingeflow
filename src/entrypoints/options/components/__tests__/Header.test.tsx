import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";

import Header from "../Header";

describe("Options Header component", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render options title and logo icon", () => {
    const res = render(() => <Header />);
    expect(res.getByText("BingeFlow")).toBeDefined();
    expect(res.container.querySelector("img")).not.toBeNull();
  });
});
