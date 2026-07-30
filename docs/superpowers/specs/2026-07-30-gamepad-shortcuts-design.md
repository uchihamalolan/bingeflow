# Gamepad Shortcuts Design Specification

## Overview

Add support for browser Gamepad API inputs to control video playback (seeking, playback speed adjustment, overlay toggling) with a flexible, extensible architecture that decoupled input event sources from command execution. The architecture easily extends to platform-specific actions (such as *Skip Intro* and *Next Episode*) in future iterations.

---

## Architectural Pattern: Event + Command Pattern

The application decouples input listeners from command execution logic:

```
[ Keyboard Events ]  ───────┐
                            │
[ Gamepad Press Events ] ───┼──>  [ Command Dispatcher ]  ──>  [ Video / Platform Handlers ]
                            │
[ Overlay UI Clicks ] ──────┘
```

1. **Input Listeners**: Capture user actions from specific hardware or DOM UI elements and convert them into abstract `Command` strings.
2. **Command Dispatcher**: Accepts a `Command` string and executes the corresponding action on the active `VideoController` or streaming platform DOM handler.
3. **Command Handlers**: Handle underlying video execution (seek, playback speed, overlay toggle, skip intro) without knowledge of the triggering input device.

---

## Technical Details & Component Breakdown

### 1. Command System & Dispatcher
- **Command Types (`src/common/commands.ts`)**:
  ```typescript
  export type VideoCommand =
    | "seekBack"
    | "seekFwd"
    | "speedDown"
    | "speedUp"
    | "resetSpeed"
    | "toggleOverlay";

  export type PlatformCommand = "skip" | "next";

  export type Command = VideoCommand | PlatformCommand;
  ```

- **Command Dispatcher (`src/entrypoints/content/commands/dispatcher.ts`)**:
  - Main dispatcher instance maintained inside content script.
  - Routes `VideoCommand` invocations to `VideoManager` / `VideoController`.
  - Routes `PlatformCommand` invocations to platform button selectors.

---

### 2. Input Listeners

- **Keyboard Listener (`src/entrypoints/content/input/keyboard-listener.ts`)**:
  - Replaces hardcoded key conditionals in `add-listeners.ts`.
  - Maps incoming `KeyboardEvent.key` to configured `keyBindings`.
  - Invokes `dispatcher.executeCommand(command)`.

- **Gamepad Listener & Edge Detector (`src/entrypoints/content/input/gamepad-listener.ts`)**:
  - Listens to `gamepadconnected` and `gamepaddisconnected` events.
  - When gamepads are active, runs a lightweight `requestAnimationFrame` polling loop over `navigator.getGamepads()`.
  - **Edge Detection**: Maintains previous button states (`prevButtonStates`) per connected gamepad.
    - Triggers only on rising edge (`false` → `true` transition).
  - **Command Lookup**: Matches pressed button index against `gamepadBindings`.
  - Invokes `dispatcher.executeCommand(command)`.

---

### 3. Data Model & Settings

- **Gamepad Settings Schema (`src/common/video-controls.ts`)**:
  ```typescript
  export type GamepadBindings = {
    enabled: boolean;
    seekBack: number | null;     // Default: 14 (D-Pad Left)
    seekFwd: number | null;      // Default: 15 (D-Pad Right)
    speedDown: number | null;    // Default: 4 (LB / L1)
    speedUp: number | null;      // Default: 5 (RB / R1)
    resetSpeed: number | null;   // Default: 0 (A / Cross)
    toggleOverlay: number | null;// Default: 3 (Y / Triangle)
  };
  ```

- **Standard Gamepad Button Mapping Labels (`src/common/gamepad-labels.ts`)**:
  Maps standard Gamepad API button indices (`0..15`) to human-readable names for options UI display.

---

### 4. Options UI Component

- **Component (`src/entrypoints/options/components/GamepadShortcuts.tsx`)**:
  - Follows repository SolidJS conventions and styling rules.
  - Master toggle switch for enabling/disabling gamepad input.
  - Action list displaying human-readable labels for currently bound gamepad buttons.
  - Interactive "Record Button" feature: Users click a button binding field, press a button on their controller, and the button index is captured and saved to extension sync storage.

---

## Verification & Testing Plan

1. **Biome Check & Typecheck**:
   - `bun run check`
   - `bun run typecheck`
2. **Manual & Unit Testing**:
   - Verify keyboard shortcuts still work seamlessly.
   - Connect a Gamepad (or simulate Gamepad API in browser) and verify edge detection triggers seeking, speed change, and overlay toggling.
   - Verify Options UI binding recording and persistent storage updating.
