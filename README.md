# BingeFlow ⏭️

A lightweight web extension built with **Svelte 5**, **TypeScript**, and **WXT** (Next-gen Web Extension Framework) that allows you to quickly skip intros, recaps, and credits, as well as control video playback on popular streaming platforms.

## Features

- **One-Key skipping**: Press a simple key (default: `S` for Skip Intro/Recap, `N` for Next Episode/Video) to trigger player actions instantly.
- **Floating Video Controls Overlay**: Hover over the video player to access a floating overlay with controls to:
  - Seek backward/forward (default: `Z` / `X`).
  - Speed up/slow down playback rate (default: `W` / `Q`).
  - Reset playback speed to normal `1×` (default: `R`).
- **Dedicated Options Page**: A settings interface to customize the extension:
  - Toggle between Catppuccin **Frappe** (dark) and **Latte** (light) color themes.
  - Customize floating video controls (toggle the overlay, adjust seek durations between 1s and 60s, and change speed increment steps between 0.05× and 2.0×).
  - Enable starting the video control overlay in a hidden state (starts invisible until mouse hover).
  - Rebind and reset default keyboard shortcuts for seek and speed controls.
- **Auto-Detection**: Automatically identifies the active streaming platform.
- **Multiple Platform Support**: Pre-configured CSS selectors for:
  - **Amazon Prime Video**
  - **Disney+ Hotstar**
  - **Netflix**

---

## Quick Start

This project uses [Bun](https://bun.sh) as the package manager and [Biome](https://biomejs.dev) for linting and formatting.

### 1. Install Dependencies
```bash
bun install
```

### 2. Run the Development Server
```bash
bun run dev
```
This starts WXT in development mode and automatically launches a sandboxed Chrome browser preloaded with the extension. It also supports hot module reloading (HMR) for both the UI pages and content scripts.

To run the development server targeting Firefox:
```bash
bun run dev:firefox
```

### 3. Load the Extension Manually (Optional)
If you wish to load the unpacked extension manually in your regular browser profile:
1. Navigate to:
   - **Chrome**: `chrome://extensions/`
   - **Firefox**: `about:debugging#/runtime/this-ops`
2. Enable **Developer mode** (or click **Load Temporary Add-on** in Firefox).
3. Click **Load unpacked** (or select manifest in Firefox).
4. Select the build directory:
   - For Chrome: `.output/chrome-mv3`
   - For Firefox: `.output/firefox-mv3`

---

## How It Works

1. **Content Script**: [src/entrypoints/content.ts](file:///Users/malolan/Projects/bingeflow/src/entrypoints/content.ts) runs on all matching pages (`matches: ["https://*/*"]`).
2. **Platform Registry**: When a page loads, the content script detects if the hostname matches any of the registered patterns in [src/common/platforms.ts](file:///Users/malolan/Projects/bingeflow/src/common/platforms.ts).
3. **Video Controls Overlay**: If enabled, the content script injects a floating controls overlay on the active video container. It listens to hover events and exposes buttons for playback adjustments.
4. **Event Listener**: When keyboard shortcuts or overlay buttons are pressed, the script updates the video's properties (like `currentTime` and `playbackRate`) or queries/clicks the page's specific skip/next buttons.
5. **Popup UI**: Clicking the extension icon displays a Svelte-based popup showing the current page's status and quick settings.
6. **Storage API**: Configuration preferences are loaded and persisted using `browser.storage.sync` (via [src/common/settings.ts](file:///Users/malolan/Projects/bingeflow/src/common/settings.ts)), while UI theme settings are saved locally using `browser.storage.local` (via [src/common/store/theme.svelte.ts](file:///Users/malolan/Projects/bingeflow/src/common/store/theme.svelte.ts)).

---

## Production Build

To compile and bundle the extension for release:

### Chrome (Manifest V3)
```bash
bun run build  # Builds into .output/chrome-mv3/
bun run zip    # Packages the build into a production-ready ZIP archive
```

### Firefox (Manifest V3)
```bash
bun run build:firefox  # Builds into .output/firefox-mv3/
bun run zip:firefox    # Packages the build into a production-ready ZIP archive
```

---

## Code Quality

Check formatting and linting rules using Biome:
```bash
bun run check        # Run linter and formatter checks
bun run fix          # Automatically fix linting and formatting issues
bun run typecheck    # Performs TypeScript compilation checks without emit
```
