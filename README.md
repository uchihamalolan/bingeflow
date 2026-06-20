# Skip Intro ⏭️

A lightweight web extension built with **Svelte 5**, **TypeScript**, and **WXT** (Next-gen Web Extension Framework) that allows you to quickly skip intros, recaps, and credits on popular streaming platforms with a single keystroke.

## Features

- **One-key skipping**: Press a simple key (default: `S`) to click the skip button instantly.
- **Auto-detection**: Automatically identifies the streaming platform you are viewing.
- **Clean Popup UI**: Shows the active platform, its extension state, and the configured shortcut.
- **Multiple Platform Support**: Pre-configured CSS selectors for:
  - **Amazon Prime Video** (Enabled by default)
  - **Disney+ Hotstar** (Enabled by default)
  - **Netflix** (Disabled by default)

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
This starts WXT in development mode and automatically launches a clean, sandboxed Chrome browser preloaded with the extension. It also supports hot module reloading (HMR) for both the UI pages and content scripts.

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

1. **Content Script**: [src/entrypoints/content.ts](file:///Users/malolan/Projects/skip-intro/src/entrypoints/content.ts) runs on all matching pages (`matches: ["https://*/*"]`).
2. **Platform Registry**: When a page loads, the content script detects if the hostname matches any of the registered patterns in [src/common/platforms.ts](file:///Users/malolan/Projects/skip-intro/src/common/platforms.ts).
3. **Event Listener**: If matched and enabled, the extension registers a keydown event listener. When the configured shortcut key is pressed, it queries the page for the platform's specific skip button selector and clicks it.
4. **Popup UI**: Clicking the extension icon displays a Svelte-based popup showing the current page's compatibility and configuration.
5. **Storage API**: Settings are loaded, managed, and persisted in `browser.storage.sync` under [src/common/settings.ts](file:///Users/malolan/Projects/skip-intro/src/common/settings.ts).

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
