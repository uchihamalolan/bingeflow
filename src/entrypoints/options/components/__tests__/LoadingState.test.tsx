import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";

import LoadingState from "../LoadingState";

describe("LoadingState component", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render loading text and spinner", () => {
    const res = render(() => <LoadingState />);
    expect(res.getByText("Loading settings...")).toBeDefined();
    expect(res.container.querySelector("span")).not.toBeNull();
  });
});
