import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";

import EnabledSites from "../EnabledSites";

describe("EnabledSites component", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render list of enabled domains", () => {
    const res = render(() => <EnabledSites enabledDomains={["netflix.com", "primevideo.com"]} />);
    expect(res.getByText("netflix.com")).toBeDefined();
    expect(res.getByText("primevideo.com")).toBeDefined();
    expect(res.getByText("2")).toBeDefined();
  });

  it("should render fallback text when domain list is empty", () => {
    const res = render(() => <EnabledSites enabledDomains={[]} />);
    expect(res.getByText(/No websites enabled/i)).toBeDefined();
  });
});
