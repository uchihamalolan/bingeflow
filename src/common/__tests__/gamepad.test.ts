import { describe, expect, it } from "vitest";

import { getGamepadButtonLabel } from "../gamepad";

describe("gamepad utils", () => {
  describe("getGamepadButtonLabel", () => {
    it("should return 'Not bound' when index is null", () => {
      expect(getGamepadButtonLabel(null)).toBe("Not bound");
    });

    it("should return known button label for standard index", () => {
      expect(getGamepadButtonLabel(0)).toBe("A / Cross");
      expect(getGamepadButtonLabel(1)).toBe("B / Circle");
      expect(getGamepadButtonLabel(14)).toBe("D-Pad Left");
      expect(getGamepadButtonLabel(15)).toBe("D-Pad Right");
    });

    it("should return 'Button X' for unknown button index", () => {
      expect(getGamepadButtonLabel(99)).toBe("Button 99");
    });
  });
});
