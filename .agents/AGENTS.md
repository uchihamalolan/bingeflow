# Coding Agent Guidelines (`AGENTS.md`)

This repository is a Google Chrome and Firefox extension named **Skip Intro**, designed to skip intros/recaps on streaming platforms. This document contains guidelines, architecture details, and commands for AI coding agents working on this codebase.

---

## 🛠️ Tech Stack & Tooling

- **Runtime & Package Manager**: [Bun](https://bun.sh/) (utilizes `bun.lock` for lockfiles, run all scripts with `bun`).
- **Framework**: [Svelte 5](https://svelte.dev/) (uses Svelte 5 runes like `$state` and `$props` for reactivity).
- **Bundler**: [WXT](https://wxt.dev/) (Next-gen Web Extension Framework built on Vite).
- **Linter & Formatter**: [Biome](https://biomejs.dev/) (configured via [biome.json](file:///Users/malolan/Projects/skip-intro/biome.json)).
- **Styling**: [Open Props](https://open-props.style/) (design tokens for CSS variables) + [Catppuccin](https://catppuccin.com/) colour theme.
- **Language**: TypeScript.

---

## 📁 Key Directories & Architecture

- **`wxt.config.ts`**: The source of truth for WXT configuration and shared extension manifest options.
- **`src/common/platforms.ts`**: Defines the supported streaming platforms, their URL patterns, CSS selectors for skip buttons, enablement status, and shortcuts.
- **`src/entrypoints/content.ts`**: The entrypoint content script that runs on all web pages. It listens to keyboard shortcuts and simulates clicking the skip buttons.
- **`src/entrypoints/popup/`**: Contains the popup interface shown when the extension icon is clicked.
  - `App.svelte`: The main entry point.
  - `states/`: Includes state sub-components (`Loading.svelte`, `Found.svelte`, `Unsupported.svelte`).
- **`src/entrypoints/options/`**: The extension options page.
- **`src/common/components/`**: Shared Svelte components (e.g. `Switch.svelte`, `Spinner.svelte`, `SettingsIcon.svelte`).

---

## 🚦 Developer & Agent Instructions

### 1. Code Style, Linters & Typechecking
- **Biome Checks**: Always run Biome check/format before declaring a task complete.
  ```bash
  bun run check  # Runs biome lint and format checks
  bun run fix    # Automatically applies biome fixes and formats
  ```
- **Typechecking**: Always run TypeScript typechecking to verify there are no compilation errors before declaring a task complete.
  ```bash
  bun run typecheck  # Performs TypeScript compilation checks without emit
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

### 4. Extension Manifest Updates
- To request new permissions or adjust matching URL patterns, modify [wxt.config.ts](file:///Users/malolan/Projects/skip-intro/wxt.config.ts) or specific entrypoint configuration objects (such as matching rules inside `src/entrypoints/content.ts`) instead of writing a raw `manifest.json`.
- Current permissions: `["storage", "tabs"]`.
- Currently matching content scripts on: `["https://*/*"]`.

### 5. Open Props Scoping
- Popup/options pages import tokens globally via [theme.css](file:///Users/malolan/Projects/skip-intro/src/common/theme.css) (attaches to `:where(html)`).
- Injected Shadow DOM components (e.g. the overlay) must define only the tokens they use directly on `:host` — see [overlay.css](file:///Users/malolan/Projects/skip-intro/src/content/overlay/overlay.css) as a reference.

### 6. Browser Extension API Usage
- Avoid calling browser extension APIs (like `browser.storage.*` or `browser.tabs.*`) directly inside Svelte components or business stores.
- Instead, define reusable wrapper/helper functions in [src/common/browser.ts](file:///Users/malolan/Projects/skip-intro/src/common/browser.ts) (e.g., `getLocalStorage`, `setLocalStorage`, `getCurrentTab`) and import them where needed.

---

## 💻 Common Commands

| Command | Action |
|---|---|
| `bun install` | Installs dependencies |
| `bun run dev` | Starts WXT dev server (automatically runs unpacked extension in Chrome) |
| `bun run dev:firefox` | Starts WXT dev server targeting Firefox MV3 |
| `bun run build` | Builds the production package under `.output/chrome-mv3` |
| `bun run build:firefox` | Builds the production package under `.output/firefox-mv3` |
| `bun run check` | Checks formatting and code quality with Biome |
| `bun run fix` | Resolves auto-fixable Biome issues |
| `bun run typecheck` | Checks TypeScript type correctness without emitting files |
