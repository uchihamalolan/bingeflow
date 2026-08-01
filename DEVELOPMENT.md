# Developer Blueprint & Architecture Guide (`DEVELOPMENT.md`)

Welcome to the **BingeFlow** developer guide! This document provides a comprehensive breakdown of the project architecture, directory structure, development workflows, and contributor conventions to help you navigate and modify the codebase efficiently.

---

## 🏗️ Architecture & Extension Boundaries

BingeFlow is built on top of the [WXT](https://wxt.dev/) Web Extension framework using **SolidJS**, **TypeScript**, **UnoCSS**, and **pnpm**.

Because browser extensions run across isolated execution environments, BingeFlow is partitioned into four primary layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Popup UI & Options Page                         │
│               (SolidJS + UnoCSS in Extension Context)                  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Reads / Writes
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Extension Storage & Settings                         │
│            (browser.storage via src/common/browser.ts)                 │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Listens for state changes
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Content Script (Isolated World)                   │
│          Matches platform URLs, captures key/gamepad shortcuts,        │
│             mounts custom Shadow DOM video control overlays             │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ CustomEvent Tunnel
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Netflix Bridge (Main World Context)                 │
│         Unlisted script injected via web_accessible_resources to       │
│           interact safely with window.netflix internal API             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
bingeflow/
├── wxt.config.ts                 # WXT configuration & shared extension manifest rules
├── configs/                      # Tool configurations (UnoCSS, Oxlint, Oxfmt, Vitest)
│   ├── uno.config.ts             # UnoCSS shortcuts & styling presets
│   ├── oxlint.config.ts          # Oxlint configuration
│   ├── oxfmt.config.ts           # Oxfmt configuration
│   └── vitest.config.ts          # Vitest testing configuration
├── decisions.md                  # Architectural Decision Records (ADRs)
└── src/
    ├── common/                   # Shared types, helpers, & platform metadata
    │   ├── platforms.ts          # Registered streaming platforms & selector definitions
    │   ├── browser.ts            # Extension API wrappers (storage, tabs)
    │   ├── settings.ts           # Settings defaults & storage handlers
    │   ├── commands.ts           # Shortcut command definitions
    │   ├── domain.ts             # Domain matching & URL helper functions
    │   └── gamepad.ts            # Gamepad shortcut handler
    └── entrypoints/              # WXT build entrypoints
        ├── content/              # Injected content script
        │   ├── index.ts          # Main content script entrypoint
        │   ├── add-listeners.ts  # Event listener attachment logic
        │   ├── overlay/          # Floating video controls Shadow DOM component
        │   ├── platform/         # Platform matching and skip button detection
        │   └── video-controller/ # Video seeking, speed control, & Netflix bridge tunnel
        ├── netflix-bridge.ts     # Main-world script for Netflix Cadmium API access
        ├── popup/                # Extension popup UI (SolidJS)
        └── options/              # Extension options/settings page (SolidJS)
```

---

## 🛠️ Developer Setup & Commands

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **pnpm** package manager

### Workflows

```bash
# 1. Install dependencies
pnpm install

# 2. Start dev server for Google Chrome (launches Chrome automatically with unpacked extension)
pnpm run dev

# 3. Start dev server for Mozilla Firefox
pnpm run dev:firefox

# 4. Production builds
pnpm run build          # Outputs to .output/chrome-mv3
pnpm run build:firefox  # Outputs to .output/firefox-mv3
```

---

## 🧪 Code Quality & Verification Commands

Always run linting, formatting, and typechecking commands before creating a Pull Request:

```bash
# Code formatting check & auto-fix
pnpm run fmt

# Code linting & type-check (oxlint type aware linting)
pnpm run lint

# Run unit tests
pnpm test
```

---

## 📖 Developer Recipes & Common Tasks

### 1. Adding Support for a New Streaming Platform

1. Open [`src/common/platforms.ts`](file:///Users/malolan/Projects/bingeflow/src/common/platforms.ts).
2. Append a new platform configuration implementing the `PlatformConfig` interface:
   ```typescript
   export const PLATFORMS: Record<string, PlatformConfig> = {
     // ... existing platforms
     my_platform: {
       label: "My Platform",
       urlPattern: /myplatform\.com/,
       skipSelector: ".skip-intro-button, .player-skip-recap",
       enabled: true,
       shortcutKey: "s",
     },
   };
   ```
3. If necessary, update the `StreamingPlatform` union type in `src/common/platforms.ts`.
4. Run `pnpm lint` and `pnpm test` to verify your changes.

### 2. Modifying Extension Settings or Shortcuts

- **Data Schema & Defaults**: Update default settings in [`src/common/settings.ts`](file:///Users/malolan/Projects/bingeflow/src/common/settings.ts).
- **Options UI**: Update the SolidJS UI components in [`src/entrypoints/options/App.tsx`](file:///Users/malolan/Projects/bingeflow/src/entrypoints/options/App.tsx).
- **Content Script Integration**: Access updated settings inside [`src/entrypoints/content/index.ts`](file:///Users/malolan/Projects/bingeflow/src/entrypoints/content/index.ts) using the helper functions in `src/common/browser.ts`.

### 3. Understanding the Netflix Custom Seeking Architecture

Standard HTML5 video seeking (`video.currentTime = ...`) causes Netflix's player state to desynchronize, leading to crashes or infinite buffer spinners.

BingeFlow handles Netflix seeking via a **Main-World Bridge**:

1. `src/entrypoints/netflix-bridge.ts` is configured in WXT as an unlisted main-world script.
2. The content script injects `/netflix-bridge.js` into the document as a authorized web resource (`web_accessible_resources`).
3. Targeted `CustomEvent` calls cross the isolated world boundary. The bridge intercepts these events in the main page context, retrieves `window.netflix.appContext`, and invokes Netflix's internal `.seek()` API safely.

---

## 📏 Engineering Principles & Best Practices

1. **Browser API Abstraction**:
   Do **not** call `browser.storage` or `chrome.storage` directly within SolidJS UI components. Always use helper methods defined in [`src/common/browser.ts`](file:///Users/malolan/Projects/bingeflow/src/common/browser.ts).
2. **Shadow DOM Scoping**:
   Overlays mounted on third-party video players are placed inside a Shadow DOM to isolate styles. Define local component styles on `:host` (see `src/entrypoints/content/overlay/`).
3. **SolidJS / TSX Styling Rules**:
   Avoid repeating utility strings. Group reusable class presets in `styles` objects and use `clsx` for dynamic variant combinations.
