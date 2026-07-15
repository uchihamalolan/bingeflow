# BingeFlow (bingeflow)

A lightweight, modern web extension that allows you to quickly skip intros, recaps, and credits, as well as control video playback on popular streaming platforms like Netflix, Prime Video, and Disney+ Hotstar.

<br />

[![Get Latest Release](https://img.shields.io/badge/GET_LATEST-DOWNLOAD_ZIP-2ea44f?style=for-the-badge&logo=github)](https://github.com/uchihamalolan/bingeflow/releases/latest)

## Features

- ⚡ **One-Key Skipping**: Press a simple key (default: `S` for Skip Intro/Recap) to trigger player actions instantly.
- 🎛️ **Floating Video Controls Overlay**: Hover over the video player to access a floating overlay with controls to:
  - Seek backward/forward (default: `Z` / `X`).
  - Speed up/slow down playback rate (default: `W` / `Q`).
  - Reset playback speed to normal `1×` (default: `R`).
- 🪄 **Smart Netflix Seeking**: While popular video controllers often freeze or crash Netflix when seeking, BingeFlow controls playback smartly and smoothly without player errors. _(See [Netflix Custom Seeking Architecture](#netflix-custom-seeking-architecture) in the technical section for details.)_
- 🪟 **Minimalist Popup UI**: A clean popup interface that lists current shortcuts, features a master enable/disable switch, and links to settings.
- 🎨 **Theme Customizability**: Supports Catppuccin **Frappe** (dark), **Latte** (light), and **System** themes.

## Installation

To install BingeFlow manually in Google Chrome without using the Chrome Web Store:

1. Download the latest `.zip` file from the project's releases page.
2. Extract the downloaded zip file into a folder on your computer.
3. Open Google Chrome and navigate to `chrome://extensions/` (or click Chrome menu -> **Extensions** -> **Manage Extensions**).
4. Turn on **Developer mode** using the toggle switch in the top-right corner.
5. Click the **Load unpacked** button in the top-left corner.
6. Select the extracted folder (`.output/chrome-mv3` or the extracted directory) to load and install the extension.

_Note: For Firefox, load the Firefox-mv3 unpacked build via `about:debugging#/runtime/this-ops`._

## How It Works

1. Clicking the extension icon opens the popup displaying active keyboard shortcuts and the main enable/disable extension switch.
2. When a video is detected, BingeFlow mounts a custom Shadow DOM controls overlay inside the player container.
3. User activity (pointer movement or key shortcuts) keeps the overlay visible, while inactivity automatically fades it out after 5 seconds to ensure an unobstructed viewing experience.
4. Settings can be accessed via the options page (accessible from both the popup and Chrome extension settings) where you can customize speed steps, seek durations, and keyboard shortcuts.

---

## 🛠️ Development & Building (Technical)

This project is built using the **WXT** framework, **SolidJS**, **TypeScript**, and **UnoCSS**, with **Bun** as the package manager.

### Netflix Custom Seeking Architecture

> [!WARNING]
> This integration accesses Netflix's internal, undocumented React/Cadmium player APIs. Because these APIs are unofficial, Netflix can modify or deprecate them at any time, which might require future updates to BingeFlow to keep seeking working in Netflix.

Standard HTML5 `<video>` seek actions (`video.currentTime = ...`) on Netflix will cause the internal player state to lose synchronization, resulting in infinite loading loops or immediate page crashes.

To bypass this limitation, BingeFlow is engineered to interface directly with Netflix's internal React/Cadmium API:

1. **Unlisted Main-World Bridge**: BingeFlow builds a standalone `netflix-bridge.js` script (defined as an unlisted script entrypoint).
2. **CSP-Compliant Injection**: Instead of injecting inline scripts (which are blocked by Netflix's strict Content Security Policy), the content script dynamically appends a script element pointing to `browser.runtime.getURL("/netflix-bridge.js")`, which is authorized under `web_accessible_resources`.
3. **Custom Event Tunneling**: The content script sends targeted `CustomEvent` calls across the isolated world boundary. The bridge intercepts these events in the main page context, retrieves the active player session ID using `window.netflix.appContext`, and invokes Netflix's internal `.seek()` method to safely advance playback.
