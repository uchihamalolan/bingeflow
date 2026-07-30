# Gamepad Shortcuts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add browser Gamepad API input support for video control shortcuts (seeking, speed adjustment, overlay toggle) with a decoupled Event + Command architecture and an Options UI configuration interface.

**Architecture:** An `Event + Command Pattern` separates input listeners (`KeyboardListener`, `GamepadListener`, Overlay clicks) from execution (`CommandDispatcher`). Gamepad input uses a lightweight `requestAnimationFrame` loop with rising-edge press detection. Command execution routes abstract commands (`seekBack`, `seekFwd`, `speedDown`, `speedUp`, `resetSpeed`, `toggleOverlay`) to the `VideoManager`.

**Tech Stack:** TypeScript, Svelte 5 / SolidJS (Options UI), Bun, WXT, Biome.

## Global Constraints

- **Language**: TypeScript (`bun run typecheck` must pass with zero errors).
- **Code Quality**: Biome lint & format (`bun run check` and `bun run fix`).
- **Framework**: SolidJS for options UI components, adhering to styles object scoping.
- **Browser API**: Use `getSyncStorage` / `setSyncStorage` wrappers from `@/common/browser`.

---

### Task 1: Command System & Gamepad Labels Types

**Files:**
- Create: `src/common/commands.ts`
- Create: `src/common/gamepad-labels.ts`
- Modify: `src/common/video-controls.ts:1-38`

**Interfaces:**
- Consumes: Existing `VideoControlsConfig`
- Produces: `Command`, `VideoCommand`, `PlatformCommand`, `GamepadBindings`, `GAMEPAD_BUTTON_LABELS`

- [ ] **Step 1: Create `src/common/commands.ts`**

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

export const VIDEO_COMMANDS: VideoCommand[] = [
  "seekBack",
  "seekFwd",
  "speedDown",
  "speedUp",
  "resetSpeed",
  "toggleOverlay",
];
```

- [ ] **Step 2: Create `src/common/gamepad-labels.ts`**

```typescript
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
```

- [ ] **Step 3: Update `src/common/video-controls.ts` to include `GamepadBindings`**

```typescript
export type GamepadBindings = {
  enabled: boolean;
  seekBack: number | null;
  seekFwd: number | null;
  speedDown: number | null;
  speedUp: number | null;
  resetSpeed: number | null;
  toggleOverlay: number | null;
};

export type VideoControlsConfig = {
  enabled: boolean;
  seekSeconds: number;
  speedStep: number;
  startHidden: boolean;
  keyBindings: {
    seekBack: string;
    seekFwd: string;
    speedDown: string;
    speedUp: string;
    resetSpeed: string;
  };
  gamepadBindings: GamepadBindings;
};

export const DEFAULT_GAMEPAD_BINDINGS: GamepadBindings = {
  enabled: true,
  seekBack: 14,     // D-Pad Left
  seekFwd: 15,      // D-Pad Right
  speedDown: 4,     // LB / L1
  speedUp: 5,       // RB / R1
  resetSpeed: 0,    // A / Cross
  toggleOverlay: 3, // Y / Triangle
};

export const DEFAULT_VIDEO_CONTROLS: VideoControlsConfig = {
  enabled: true,
  seekSeconds: 5,
  speedStep: 0.25,
  startHidden: false,
  keyBindings: {
    seekBack: "z",
    seekFwd: "x",
    speedDown: "q",
    speedUp: "w",
    resetSpeed: "r",
  },
  gamepadBindings: DEFAULT_GAMEPAD_BINDINGS,
};
```

- [ ] **Step 4: Run typecheck and biome fix**

Run: `bun run check && bun run typecheck`
Expected: PASS with zero errors.

- [ ] **Step 5: Commit**

```bash
git add src/common/commands.ts src/common/gamepad-labels.ts src/common/video-controls.ts
git commit -m "feat: add Command types, Gamepad labels, and GamepadBindings config"
```

---

### Task 2: Command Dispatcher

**Files:**
- Create: `src/entrypoints/content/commands/dispatcher.ts`

**Interfaces:**
- Consumes: `Command`, `VideoManager`, `PlatformConfig`, `getPlatformBehaviors`
- Produces: `CommandDispatcher` class with `executeCommand(command: Command): void` method.

- [ ] **Step 1: Create `src/entrypoints/content/commands/dispatcher.ts`**

```typescript
import type { Command, VideoCommand } from "@/common/commands";
import { getPlatformBehaviors, type PlatformConfig } from "@/common/platforms";
import type { VideoManager } from "../video/video-manager";

interface Props {
  videoManager: VideoManager;
  platformConfig: PlatformConfig | null;
}

export class CommandDispatcher {
  private videoManager: VideoManager;
  private platformConfig: PlatformConfig | null;

  constructor({ videoManager, platformConfig }: Props) {
    this.videoManager = videoManager;
    this.platformConfig = platformConfig;
  }

  public updatePlatformConfig(config: PlatformConfig | null) {
    this.platformConfig = config;
  }

  public executeCommand(command: Command): void {
    const controller = this.videoManager.getController();
    const config = this.videoManager.getConfig();

    if (this.isVideoCommand(command)) {
      if (controller === null) return;
      const { seekSeconds, speedStep } = config;

      switch (command) {
        case "toggleOverlay":
          this.videoManager.toggleOverlay();
          break;
        case "seekBack":
          controller.seek(-seekSeconds);
          this.videoManager.triggerActivity();
          break;
        case "seekFwd":
          controller.seek(seekSeconds);
          this.videoManager.triggerActivity();
          break;
        case "speedDown": {
          const current = controller.getPlaybackRate();
          controller.setPlaybackRate(current - speedStep);
          this.videoManager.triggerActivity();
          break;
        }
        case "speedUp": {
          const current = controller.getPlaybackRate();
          controller.setPlaybackRate(current + speedStep);
          this.videoManager.triggerActivity();
          break;
        }
        case "resetSpeed":
          controller.setPlaybackRate(1.0);
          this.videoManager.triggerActivity();
          break;
      }
      return;
    }

    // Platform command handling (skip, next)
    if (this.platformConfig === null) return;
    for (const behavior of getPlatformBehaviors(this.platformConfig)) {
      if (behavior.enabled && behavior.type === command) {
        document.querySelector<HTMLElement>(behavior.selector)?.click();
        break;
      }
    }
  }

  private isVideoCommand(command: Command): command is VideoCommand {
    return [
      "seekBack",
      "seekFwd",
      "speedDown",
      "speedUp",
      "resetSpeed",
      "toggleOverlay",
    ].includes(command);
  }
}
```

- [ ] **Step 2: Run typecheck and biome fix**

Run: `bun run check && bun run typecheck`
Expected: PASS with zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/entrypoints/content/commands/dispatcher.ts
git commit -m "feat: implement CommandDispatcher for unified command execution"
```

---

### Task 3: Input Listeners (Keyboard & Gamepad Edge Detection)

**Files:**
- Create: `src/entrypoints/content/input/keyboard-listener.ts`
- Create: `src/entrypoints/content/input/gamepad-listener.ts`
- Modify: `src/entrypoints/content/add-listeners.ts:1-68`

**Interfaces:**
- Consumes: `CommandDispatcher`, `isValidPress`, `VideoManager`, `PlatformConfig`, `getPlatformBehaviors`
- Produces: `initKeyboardListener`, `GamepadListener` class

- [ ] **Step 1: Create `src/entrypoints/content/input/keyboard-listener.ts`**

```typescript
import type { Command } from "@/common/commands";
import { getPlatformBehaviors, type PlatformConfig } from "@/common/platforms";
import type { CommandDispatcher } from "../commands/dispatcher";
import { isValidPress } from "../utils/validpress";
import type { VideoManager } from "../video/video-manager";

interface Props {
  dispatcher: CommandDispatcher;
  videoManager: VideoManager;
  platformConfig: PlatformConfig | null;
  platformShortcuts: Set<string>;
}

export function initKeyboardListener({
  dispatcher,
  videoManager,
  platformConfig,
  platformShortcuts,
}: Props): () => void {
  const handler = (e: KeyboardEvent) => {
    if (!isValidPress(e)) return;

    const controller = videoManager.getController();

    // Check video control keyboard bindings if key is not reserved by platform shortcut
    if (controller !== null && !platformShortcuts.has(e.key)) {
      if (e.key.toLowerCase() === "v") {
        dispatcher.executeCommand("toggleOverlay");
        return;
      }

      const { keyBindings } = videoManager.getConfig();
      let matchedCommand: Command | null = null;

      if (e.key === keyBindings.seekBack) matchedCommand = "seekBack";
      else if (e.key === keyBindings.seekFwd) matchedCommand = "seekFwd";
      else if (e.key === keyBindings.speedDown) matchedCommand = "speedDown";
      else if (e.key === keyBindings.speedUp) matchedCommand = "speedUp";
      else if (e.key === keyBindings.resetSpeed) matchedCommand = "resetSpeed";

      if (matchedCommand !== null) {
        dispatcher.executeCommand(matchedCommand);
        return;
      }
    }

    // Check platform behavior shortcuts (e.g., skip, next)
    if (platformConfig === null) return;
    for (const behavior of getPlatformBehaviors(platformConfig)) {
      if (behavior.enabled && e.key === behavior.shortcutKey) {
        dispatcher.executeCommand(behavior.type);
        break;
      }
    }
  };

  document.addEventListener("keydown", handler);
  return () => document.removeEventListener("keydown", handler);
}
```

- [ ] **Step 2: Create `src/entrypoints/content/input/gamepad-listener.ts`**

```typescript
import type { Command } from "@/common/commands";
import type { GamepadBindings } from "@/common/video-controls";
import type { CommandDispatcher } from "../commands/dispatcher";

interface Props {
  dispatcher: CommandDispatcher;
  getBindings: () => GamepadBindings;
}

export class GamepadListener {
  private dispatcher: CommandDispatcher;
  private getBindings: () => GamepadBindings;
  private animationFrameId: number | null = null;

  /** Map of gamepadIndex -> array of previous button pressed booleans */
  private prevButtonStates: Map<number, boolean[]> = new Map();

  constructor({ dispatcher, getBindings }: Props) {
    this.dispatcher = dispatcher;
    this.getBindings = getBindings;

    this.onGamepadConnected = this.onGamepadConnected.bind(this);
    this.onGamepadDisconnected = this.onGamepadDisconnected.bind(this);
    this.pollLoop = this.pollLoop.bind(this);
  }

  public start(): void {
    window.addEventListener("gamepadconnected", this.onGamepadConnected);
    window.addEventListener("gamepaddisconnected", this.onGamepadDisconnected);
    this.checkActiveGamepads();
  }

  public stop(): void {
    window.removeEventListener("gamepadconnected", this.onGamepadConnected);
    window.removeEventListener("gamepaddisconnected", this.onGamepadDisconnected);
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.prevButtonStates.clear();
  }

  private onGamepadConnected(e: GamepadEvent): void {
    this.checkActiveGamepads();
  }

  private onGamepadDisconnected(e: GamepadEvent): void {
    this.prevButtonStates.delete(e.gamepad.index);
    this.checkActiveGamepads();
  }

  private checkActiveGamepads(): void {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const hasConnected = Array.from(gamepads).some((gp) => gp !== null && gp.connected);

    if (hasConnected && this.animationFrameId === null) {
      this.pollLoop();
    } else if (!hasConnected && this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private pollLoop(): void {
    const bindings = this.getBindings();

    if (bindings.enabled) {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

      for (const gamepad of gamepads) {
        if (!gamepad || !gamepad.connected) continue;

        const prevStates = this.prevButtonStates.get(gamepad.index) ?? [];
        const currentStates: boolean[] = [];

        for (let i = 0; i < gamepad.buttons.length; i++) {
          const isPressed = gamepad.buttons[i].pressed;
          const wasPressed = prevStates[i] ?? false;

          // Detect rising edge: transition from unpressed to pressed
          if (isPressed && !wasPressed) {
            const command = this.findCommandForButton(i, bindings);
            if (command !== null) {
              this.dispatcher.executeCommand(command);
            }
          }

          currentStates.push(isPressed);
        }

        this.prevButtonStates.set(gamepad.index, currentStates);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.pollLoop);
  }

  private findCommandForButton(buttonIndex: number, bindings: GamepadBindings): Command | null {
    if (bindings.seekBack === buttonIndex) return "seekBack";
    if (bindings.seekFwd === buttonIndex) return "seekFwd";
    if (bindings.speedDown === buttonIndex) return "speedDown";
    if (bindings.speedUp === buttonIndex) return "speedUp";
    if (bindings.resetSpeed === buttonIndex) return "resetSpeed";
    if (bindings.toggleOverlay === buttonIndex) return "toggleOverlay";
    return null;
  }
}
```

- [ ] **Step 3: Update `src/entrypoints/content/add-listeners.ts` to wire Dispatcher and Input Listeners**

```typescript
import type { PlatformConfig } from "@/common/platforms";

import { CommandDispatcher } from "./commands/dispatcher";
import { GamepadListener } from "./input/gamepad-listener";
import { initKeyboardListener } from "./input/keyboard-listener";
import type { VideoManager } from "./video/video-manager";

interface Props {
  videoManager: VideoManager;
  platformConfig: PlatformConfig | null;
  platformShortcuts: Set<string>;
}

export function addEventListeners({ videoManager, platformConfig, platformShortcuts }: Props) {
  const dispatcher = new CommandDispatcher({
    videoManager,
    platformConfig,
  });

  // Initialize keyboard listener
  initKeyboardListener({
    dispatcher,
    videoManager,
    platformConfig,
    platformShortcuts,
  });

  // Initialize gamepad listener
  const gamepadListener = new GamepadListener({
    dispatcher,
    getBindings: () => videoManager.getConfig().gamepadBindings,
  });

  gamepadListener.start();
}
```

- [ ] **Step 4: Run typecheck and biome fix**

Run: `bun run check && bun run typecheck`
Expected: PASS with zero errors.

- [ ] **Step 5: Commit**

```bash
git add src/entrypoints/content/input/ src/entrypoints/content/add-listeners.ts
git commit -m "feat: implement KeyboardListener and GamepadListener with edge detection"
```

---

### Task 4: Options UI Gamepad Configuration Component

**Files:**
- Create: `src/entrypoints/options/components/GamepadShortcuts.tsx`
- Modify: `src/entrypoints/options/App.tsx:1-92`

**Interfaces:**
- Consumes: `VideoControlsConfig`, `GamepadBindings`, `getGamepadButtonLabel`, `clsx`
- Produces: `GamepadShortcuts` component with gamepad recording UI

- [ ] **Step 1: Create `src/entrypoints/options/components/GamepadShortcuts.tsx`**

```tsx
import { clsx } from "clsx";
import { createSignal, onCleanup, onMount, For } from "solid-js";

import { getGamepadButtonLabel } from "@/common/gamepad-labels";
import type { GamepadBindings, VideoControlsConfig } from "@/common/video-controls";

const styles = {
  card: "p-6 rounded-lg bg-mantle border border-surface0 flex flex-col gap-4 shadow-sm",
  header: "flex items-center justify-between border-b border-surface0 pb-3",
  title: "text-lg font-semibold text-text flex items-center gap-2",
  description: "text-xs text-subtext0 mt-1",
  toggleContainer: "flex items-center gap-3",
  grid: "grid grid-cols-1 gap-3 sm:grid-cols-2",
  field: "flex flex-col gap-1.5 p-3 rounded-md bg-crust border border-surface0",
  label: "text-xs font-medium text-subtext1",
  button: "w-full py-2 px-3 rounded text-sm font-mono text-center transition-colors cursor-pointer border",
  buttonIdle: "bg-surface0 text-text border-surface1 hover:bg-surface1",
  buttonRecording: "bg-mauve/20 text-mauve border-mauve animate-pulse",
};

interface Props {
  videoControls: VideoControlsConfig;
  onchange: (updater: (controls: VideoControlsConfig) => void) => void;
}

type BoundActionKey = keyof Omit<GamepadBindings, "enabled">;

const ACTIONS: { key: BoundActionKey; label: string }[] = [
  { key: "seekBack", label: "Seek Backward" },
  { key: "seekFwd", label: "Seek Forward" },
  { key: "speedDown", label: "Decrease Speed" },
  { key: "speedUp", label: "Increase Speed" },
  { key: "resetSpeed", label: "Reset Speed" },
  { key: "toggleOverlay", label: "Toggle Overlay" },
];

export default function GamepadShortcuts(props: Props) {
  const [recordingKey, setRecordingKey] = createSignal<BoundActionKey | null>(null);
  let pollId: number | null = null;

  const handleToggleGamepad = (enabled: boolean) => {
    props.onchange((controls) => {
      controls.gamepadBindings.enabled = enabled;
    });
  };

  const startRecording = (key: BoundActionKey) => {
    setRecordingKey(key);
  };

  // Poll for gamepad button press when recording a shortcut key
  onMount(() => {
    const checkGamepadInput = () => {
      const activeKey = recordingKey();
      if (activeKey !== null) {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (const gp of gamepads) {
          if (!gp || !gp.connected) continue;
          for (let i = 0; i < gp.buttons.length; i++) {
            if (gp.buttons[i].pressed) {
              const pressedIndex = i;
              props.onchange((controls) => {
                controls.gamepadBindings[activeKey] = pressedIndex;
              });
              setRecordingKey(null);
              break;
            }
          }
        }
      }
      pollId = requestAnimationFrame(checkGamepadInput);
    };

    pollId = requestAnimationFrame(checkGamepadInput);
  });

  onCleanup(() => {
    if (pollId !== null) cancelAnimationFrame(pollId);
  });

  return (
    <div class={styles.card}>
      <div class={styles.header}>
        <div>
          <h2 class={styles.title}>Gamepad Shortcuts</h2>
          <p class={styles.description}>Control playback using a connected controller</p>
        </div>
        <div class={styles.toggleContainer}>
          <input
            type="checkbox"
            id="gamepad-toggle"
            checked={props.videoControls.gamepadBindings?.enabled ?? true}
            onChange={(e) => handleToggleGamepad(e.currentTarget.checked)}
            class="toggle accent-mauve cursor-pointer"
          />
        </div>
      </div>

      <div class={styles.grid}>
        <For each={ACTIONS}>
          {(action) => {
            const isRecording = () => recordingKey() === action.key;
            const boundValue = () =>
              props.videoControls.gamepadBindings
                ? props.videoControls.gamepadBindings[action.key]
                : null;

            return (
              <div class={styles.field}>
                <span class={styles.label}>{action.label}</span>
                <button
                  type="button"
                  class={clsx(
                    styles.button,
                    isRecording() ? styles.buttonRecording : styles.buttonIdle
                  )}
                  onClick={() => startRecording(action.key)}
                >
                  {isRecording() ? "Press any button..." : getGamepadButtonLabel(boundValue())}
                </button>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add `GamepadShortcuts` component to `src/entrypoints/options/App.tsx`**

```tsx
import GamepadShortcuts from "./components/GamepadShortcuts";
// Inside mainContent grid in App.tsx:
<main class={styles.mainContent}>
  <VideoControls videoControls={s().videoControls} onchange={handleVideoControlsChange} />
  <KeyboardShortcuts
    videoControls={s().videoControls}
    onchange={handleVideoControlsChange}
  />
  <GamepadShortcuts
    videoControls={s().videoControls}
    onchange={handleVideoControlsChange}
  />
</main>
```

- [ ] **Step 3: Run typecheck and biome check/fix**

Run: `bun run check && bun run typecheck`
Expected: PASS with zero lint errors and zero type errors.

- [ ] **Step 4: Commit**

```bash
git add src/entrypoints/options/components/GamepadShortcuts.tsx src/entrypoints/options/App.tsx
git commit -m "feat: add GamepadShortcuts options UI component for button rebinding"
```

---

### Task 5: Final Verification

**Files:**
- None (Verification task across whole project)

- [ ] **Step 1: Run full lint check & auto-fix**

Run: `bun run fix && bun run check`
Expected: PASS with zero issues.

- [ ] **Step 2: Run TypeScript typechecking**

Run: `bun run typecheck`
Expected: PASS with zero compilation errors.

- [ ] **Step 3: Run project build**

Run: `bun run build`
Expected: Production bundle under `.output/chrome-mv3` builds successfully.

- [ ] **Step 4: Commit final verification baseline if any formatting adjustments were made**

```bash
git commit -m "chore: format and verify project builds clean" || true
```
