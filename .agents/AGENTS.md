# Coding Agent Guidelines (`AGENTS.md`)

This repository is a Google Chrome and Firefox extension named **BingeFlow** (formerly Skip Intro), designed to skip intros/recaps and provide advanced playback/gamepad controls across streaming platforms. This document contains guidelines, architecture details, and developer conventions for AI coding agents working on this codebase.

---

## 🛠️ Tech Stack & Tooling

- **Runtime & Package Manager**: [pnpm](https://pnpm.io/) (utilizes `pnpm-lock.yaml` for lockfiles, run scripts with `pnpm`).
- **Framework**: [SolidJS](https://www.solidjs.com/) (uses TSX and SolidJS signals/stores for UI components).
- **Bundler**: [WXT](https://wxt.dev/) (Next-gen Web Extension Framework built on Vite).
- **Testing**: [Vitest](https://vitest.dev/) with Solid Testing Library and User Event simulation.
- **Linter & Formatter**: [Biome](https://biomejs.dev/) + [Oxlint](https://oxc.rs/) & [Oxfmt](https://oxc.rs/) (configured under `configs/`).
- **Styling**: [UnoCSS](https://unocss.dev/) + [Open Props](https://open-props.style/) design tokens + [Catppuccin](https://catppuccin.com/) color palette.
- **Language**: TypeScript.

---

## 📁 Key Directories & Architecture

- **`wxt.config.ts`**: The source of truth for WXT configuration and shared extension manifest options.
- **`configs/`**: Tool configuration directory containing `uno.config.ts`, `oxlint.config.ts`, `oxfmt.config.ts`, and `vitest.config.ts`.
- **`src/common/`**: Shared platform definitions, browser extension API wrappers, settings schema, commands, gamepad bindings, and reusable UI components:
  - `platforms.ts`: Defines supported streaming platforms, URL match patterns, and skip selectors.
  - `browser.ts`: Encapsulated wrapper functions for `browser.storage` and `browser.tabs`.
  - `settings.ts`: Default user preferences and storage sync logic.
  - `commands.ts` & `gamepad.ts`: Hardware input types and shortcut configs.
  - `utils/cx.ts`: Utility for merging class names using `clsx`.
- **`src/entrypoints/content/`**: The core content script engine (isolated world):
  - `index.ts`: Content script entrypoint and lifecycle initialization.
  - `commands/`: Centralized Command Pattern dispatcher (`dispatcher.ts`).
  - `input/`: Keyboard and Gamepad hardware listeners (`keyboard-listener.ts`, `gamepad-listener.ts`).
  - `overlay/`: Floating Shadow DOM overlay player controls (`overlay.ts`, `overlay.css`).
  - `platform/`: Platform matching and skip button automation (`platform-manager.ts`).
  - `video/`: Video element tracking and DOM management (`video-manager.ts`).
  - `video-controller/`: Polymorphic video player strategies (`html5-video-controller.ts`, `netflix-video-controller.ts`).
- **`src/entrypoints/netflix-bridge.ts`**: Unlisted main-world script injected via `web_accessible_resources` for Netflix Cadmium API interaction.
- **`src/entrypoints/popup/`**: Extension popup UI (`App.tsx`, `main.ts`, `index.html`).
- **`src/entrypoints/options/`**: Extension options page UI (`App.tsx`, `main.ts`, `index.html`).

---

## 🚦 Developer & Agent Instructions

### 1. Code Style, Linters & Typechecking

- **Lint & Format Checks**: Always run lint/fmt checks before declaring a task complete.
  ```bash
  pnpm run lint  # Runs lint & oxlint checks
  pnpm run fmt   # Automatically formats code with Biome / oxfmt
  ```
- **Typechecking**: Always run TypeScript typechecking to verify there are no compilation errors:
  ```bash
  ./node_modules/.bin/tsc --noEmit
  ```
- **Automated Unit Testing**: Always verify existing and new tests pass before completing tasks:
  ```bash
  pnpm test
  ```

### 2. SolidJS Component Styling & Best Practices

- **SolidJS Signals & Props**: Use SolidJS reactive signals/stores and explicit TSX interfaces.
- **Never Pass Raw Inline Style Strings**: Define styling classes in a local static `styles` object at the top of the component file, referencing them as `{styles.className}`.
- **Class Duplication Prevention**: Extract base style classes into shared strings and use `clsx` or `cx` to compose dynamic variant styles.

  ```typescript
  import { clsx } from "clsx";

  const styles = {
    base: "flex items-center justify-center rounded-sm bg-transparent",
    sizes: {
      sm: "w-4 h-4 border-1",
      lg: "w-8 h-8 border-2",
    },
  };

  interface Props {
    size: "sm" | "lg";
  }

  export default function MyComponent(props: Props) {
    return (
      <div class={clsx(styles.base, styles.sizes[props.size])}>
        <span>Icon</span>
      </div>
    );
  }
  ```

### 3. UnoCSS Shortcuts & `cx` Rules

- **Prefer Shortcuts for Uniform Design**: Always extract reusable, multi-class component patterns into `shortcuts` inside [configs/uno.config.ts](file:///Users/malolan/Projects/bingeflow/configs/uno.config.ts).
- **`cx` Usage Threshold**:
  - Use direct strings or `clsx()` for short class lists (< 6 classes).
  - Reserve `cx({ ... })` for complex category style blocks containing 6 or more classes.

### 4. Adding a New Platform

1. Open [src/common/platforms.ts](file:///Users/malolan/Projects/bingeflow/src/common/platforms.ts).
2. Append a new key to the `PLATFORMS` object implementing `PlatformConfig`:
   ```typescript
   export const PLATFORMS: Record<string, PlatformConfig> = {
     my_platform: {
       label: "My Platform",
       urlPattern: /myplatform\.com/,
       skipSelector: ".skip-intro-button, .player-skip-recap",
       enabled: true,
       shortcutKey: "s",
     },
   };
   ```
3. Run `pnpm lint` and `pnpm test` to verify integration.

### 5. Extension API & Shadow DOM Scoping

- **Browser API Wrappers**: Never call `browser.storage.*` directly inside SolidJS components. Always use wrapper functions defined in [src/common/browser.ts](file:///Users/malolan/Projects/bingeflow/src/common/browser.ts).
- **Shadow DOM Scoping**: Components injected into video player pages (like overlays) must define styles isolated on `:host` (see `src/entrypoints/content/overlay/overlay.css`).

### 6. Command Error Handling

- **Immediate Reporting on Failure**: If any shell command fails (e.g., `command not found`, failed script execution, build error), **stop execution immediately** and report the exact failure output to the user. Do not attempt unrequested workarounds or silent fallback execution without user intervention.

---

## 💻 Common Commands

| Command                            | Action                                                    |
| ---------------------------------- | --------------------------------------------------------- |
| `pnpm install`                     | Installs dependencies                                     |
| `pnpm run dev`                     | Starts WXT dev server targeting Chrome MV3                |
| `pnpm run dev:firefox`             | Starts WXT dev server targeting Firefox MV3               |
| `pnpm run build`                   | Builds production package under `.output/chrome-mv3`      |
| `pnpm run build:firefox`           | Builds production package under `.output/firefox-mv3`     |
| `pnpm run lint`                    | Runs code linting & type checks                           |
| `pnpm run fmt`                     | Formats codebase using Biome / oxfmt                      |
| `pnpm test`                        | Runs Vitest unit & component test suite                   |
| `./node_modules/.bin/tsc --noEmit` | Checks TypeScript type correctness without emitting files |
