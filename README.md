# Skip Intro ⏭️

A lightweight Chrome Extension built with **Svelte 5**, **TypeScript**, and **Vite** (via CRXJS) that allows you to quickly skip intros, recaps, and credits on popular streaming platforms with a single keystroke.

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
This starts the Vite dev server and generates an unpacked extension in the `dist` directory.

### 3. Load the Extension in Chrome
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Toggle **Developer mode** on in the top-right corner.
3. Click **Load unpacked** in the top-left corner.
4. Select the `dist` directory in your project folder.

---

## How It Works

1. **Content Script**: [src/content/main.ts](file:///Users/malolan/Projects/skip-intro/src/content/main.ts) runs on all pages (`matches: ["https://*/*"]`).
2. **Platform Registry**: When a page loads, the content script detects if the hostname matches any of the registered patterns in [src/common/platforms.ts](file:///Users/malolan/Projects/skip-intro/src/common/platforms.ts).
3. **Event Listener**: If matched and enabled, the extension registers a keydown event listener. When the configured shortcut key is pressed, it queries the page for the platform's specific skip button selector and clicks it.
4. **Popup UI**: Clicking the extension icon displays a popup showing the current page's compatibility and configuration.

---

## Production Build

To compile and bundle the extension for release:
```bash
bun run build
```
This builds the extension into the `dist` directory and packages it into a production-ready ZIP file.

---

## Code Quality

Check formatting and linting rules using Biome:
```bash
bun run check  # Run linter and formatter checks
bun run fix    # Automatically fix linting and formatting issues
```
