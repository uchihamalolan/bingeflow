# Coding Agent Guidelines (`AGENTS.md`)

This repository is a Google Chrome extension named **Skip Intro**, designed to skip intros/recaps on streaming platforms. This document contains guidelines, architecture details, and commands for AI coding agents working on this codebase.

---

## 🛠️ Tech Stack & Tooling

- **Runtime & Package Manager**: [Bun](https://bun.sh/) (utilizes `bun.lock` for lockfiles, run all scripts with `bun`).
- **Framework**: [Svelte 5](https://svelte.dev/) (uses Svelte 5 runes like `$state` and `$props` for reactivity).
- **Bundler**: [Vite](https://vite.dev/) with [@crxjs/vite-plugin](https://crxjs.dev/) (Manifest V3 support).
- **Linter & Formatter**: [Biome](https://biomejs.dev/) (configured via [biome.json](file:///Users/malolan/Projects/skip-intro/biome.json)).
- **Styling**: [Open Props](https://open-props.style/) (design tokens for CSS variables) + [Catppuccin](https://catppuccin.com/) colour theme.
- **Language**: TypeScript.

---

## 📁 Key Directories & Architecture

- **`manifest.config.ts`**: The source of truth for the Chrome extension manifest. CRXJS reads this to build the `manifest.json`.
- **`src/common/platforms.ts`**: Defines the supported streaming platforms, their URL patterns, CSS selectors for skip buttons, enablement status, and shortcuts.
- **`src/content/main.ts`**: The content script that runs on all web pages. It listens to keyboard shortcuts and simulates clicking the skip buttons.
- **`src/popup/`**: Contains the popup interface shown when the extension icon is clicked.
  - `App.svelte`: The main entry point.
  - `states/`: Includes state sub-components (`Loading.svelte`, `Found.svelte`, `Unsupported.svelte`).
- **`src/options/`**: The extension options page.
- **`src/common/components/`**: Shared Svelte components (e.g. `Switch.svelte`, `Spinner.svelte`, `SettingsIcon.svelte`).

---

## 🚦 Developer & Agent Instructions

### 1. Code Style and Linters
- **Biome Checks**: Always run Biome check/format before declaring a task complete.
  ```bash
  bun run check  # Runs biome lint and format checks
  bun run fix    # Automatically applies biome fixes and formats
  ```
- **Lint Errors**: Ensure all changes conform to the rules in [biome.json](file:///Users/malolan/Projects/skip-intro/biome.json).

### 2. Svelte Components & Styling
- For Svelte 5 runes, props typing, and file conventions → see skill **`svelte-conventions`**.
- For semantic HTML element choices, CSS class rules, and minimal styling → see skill **`svelte-styling`**.

### 3. Adding a New Platform
To add support for a new streaming platform:
1. Open [src/common/platforms.ts](file:///Users/malolan/Projects/skip-intro/src/common/platforms.ts).
2. Append a new key to the `PLATFORMS` object implementing the `PlatformConfig` type:
   - `label`: Display name of the service.
   - `urlPattern`: Regular expression targeting the streaming site's domain.
   - `skipSelector`: CSS selector matching the skip intro/recap button.
   - `enabled`: Initial enabled status.
   - `shortcutKey`: Keyboard button (e.g., `"s"`).
3. If necessary, register the platform type in the `StreamingPlatform` union type.

### 4. Chrome Extension Manifest Updates
- To request new permissions or adjust matching URL patterns, modify [manifest.config.ts](file:///Users/malolan/Projects/skip-intro/manifest.config.ts) instead of creating or editing a raw `manifest.json`.
- Current permissions: `["contentSettings", "tabs"]`.
- Currently matching content scripts on: `["https://*/*"]`.

### 5. Open Props Scoping
- Popup/options pages import tokens globally via [theme.css](file:///Users/malolan/Projects/skip-intro/src/common/theme.css) (attaches to `:where(html)`).
- Injected Shadow DOM components (e.g. the overlay) must define only the tokens they use directly on `:host` — see [overlay.css](file:///Users/malolan/Projects/skip-intro/src/content/overlay/overlay.css) as a reference.

---

## 💻 Common Commands

| Command | Action |
|---|---|
| `bun install` | Installs dependencies |
| `bun run dev` | Starts Vite dev server with CRXJS hot-reloading |
| `bun run build` | Builds the production package under `/dist` |
| `bun run check` | Checks formatting and code quality with Biome |
| `bun run fix` | Resolves auto-fixable Biome issues |
