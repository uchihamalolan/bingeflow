export type GamepadBindings = {
  enabled: boolean;
  seekBack: number | null;
  seekFwd: number | null;
  speedDown: number | null;
  speedUp: number | null;
  resetSpeed: number | null;
  toggleOverlay: number | null;
};

export type KeyBindings = {
  seekBack: string;
  seekFwd: string;
  speedDown: string;
  speedUp: string;
  resetSpeed: string;
  toggleOverlay: string;
};

export type VideoControlsConfig = {
  enabled: boolean;
  seekSeconds: number;
  speedStep: number;
  startHidden: boolean;
  keyBindings: KeyBindings;
  gamepadBindings: GamepadBindings;
};

export const DEFAULT_GAMEPAD_BINDINGS: GamepadBindings = {
  enabled: true,
  seekBack: 14, // D-Pad Left
  seekFwd: 15, // D-Pad Right
  speedDown: 4, // LB / L1
  speedUp: 5, // RB / R1
  resetSpeed: 0, // A / Cross
  toggleOverlay: 3, // Y / Triangle
};

export const DEFAULT_KEY_BINDINGS: KeyBindings = {
  seekBack: "z",
  seekFwd: "x",
  speedDown: "q",
  speedUp: "w",
  resetSpeed: "r",
  toggleOverlay: "v",
}

export const DEFAULT_VIDEO_CONTROLS: VideoControlsConfig = {
  enabled: true,
  seekSeconds: 5,
  speedStep: 0.25,
  startHidden: false,
  keyBindings: DEFAULT_KEY_BINDINGS,
  gamepadBindings: DEFAULT_GAMEPAD_BINDINGS,
};
