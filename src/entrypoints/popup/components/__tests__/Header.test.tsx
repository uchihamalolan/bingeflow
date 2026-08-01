import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";

import Header from "../Header";

describe("Header component", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render logo and theme/settings controls", () => {
    const res = render(() => <Header />);
    expect(res.getByText("BingeFlow")).toBeDefined();
    expect(res.container.querySelector("img")).not.toBeNull();
  });
});
