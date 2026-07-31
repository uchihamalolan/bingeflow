export const GAMEPAD_BUTTON_LABELS: Record<number, string> = {
  0: "A / Cross",
  1: "B / Circle",
  2: "X / Square",
  3: "Y / Triangle",
  4: "LB / L1",
  5: "RB / R1",
  6: "LT / L2",
  7: "RT / R2",
  8: "Select / Share",
  9: "Start / Options",
  10: "L3 (Left Stick Click)",
  11: "R3 (Right Stick Click)",
  12: "D-Pad Up",
  13: "D-Pad Down",
  14: "D-Pad Left",
  15: "D-Pad Right",
  16: "Home / Xbox / PS",
};

export function getGamepadButtonLabel(buttonIndex: number | null): string {
  if (buttonIndex === null) return "Not bound";
  return GAMEPAD_BUTTON_LABELS[buttonIndex] ?? `Button ${buttonIndex}`;
}
