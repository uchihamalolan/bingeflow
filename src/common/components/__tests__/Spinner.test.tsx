import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";

import Spinner from "../Spinner";

describe("Spinner component", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render default medium size spinner", () => {
    const res = render(() => <Spinner />);
    const span = res.container.querySelector("span");
    expect(span).not.toBeNull();
    expect(span?.className).toContain("w-6 h-6");
  });

  it("should render small size spinner", () => {
    const res = render(() => <Spinner size="small" />);
    const span = res.container.querySelector("span");
    expect(span?.className).toContain("w-5 h-5");
  });

  it("should render large size spinner", () => {
    const res = render(() => <Spinner size="large" />);
    const span = res.container.querySelector("span");
    expect(span?.className).toContain("w-8 h-8");
  });
});
