import { describe, expect, it } from "vitest";

import { cx } from "../cx";

describe("cx utility", () => {
  it("should return empty string when categories object is empty", () => {
    expect(cx({})).toBe("");
  });

  it("should combine defined categorized style values", () => {
    const result = cx({
      preset: "flex-center",
      layout: "flex items-center",
      colors: "bg-primary text-white",
    });

    expect(result).toBe("flex-center flex items-center bg-primary text-white");
  });

  it("should ignore falsey, null, or undefined values", () => {
    const result = cx({
      preset: "card-panel",
      layout: false,
      colors: undefined,
      spacing: null,
      sizing: "w-full",
    });

    expect(result).toBe("card-panel w-full");
  });

  it("should trim and normalize whitespace between combined classes", () => {
    const result = cx({
      layout: "  flex   items-center  ",
      colors: " text-red-500  ",
    });

    expect(result).toBe("flex items-center text-red-500");
  });
});
