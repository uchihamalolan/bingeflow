import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";

import Toast from "../Toast";

describe("Toast component", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render nothing when saveStatus is idle", () => {
    const res = render(() => <Toast saveStatus="idle" />);
    expect(res.container.querySelector("output")).toBeNull();
  });

  it("should render success toast when saveStatus is success", () => {
    const res = render(() => <Toast saveStatus="success" />);
    const output = res.getByRole("status");

    expect(output).toBeDefined();
    expect(res.container.querySelector(".border-green")).not.toBeNull();
  });

  it("should render error toast when saveStatus is error", () => {
    const res = render(() => <Toast saveStatus="error" />);
    const output = res.getByRole("status");

    expect(output).toBeDefined();
    expect(res.container.querySelector(".border-red")).not.toBeNull();
  });
});
