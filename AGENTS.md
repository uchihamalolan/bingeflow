# Coding Agent Guidelines (`AGENTS.md`)

This repository is a Google Chrome extension named **Skip Intro**, designed to skip intros/recaps on streaming platforms. This document contains guidelines, architecture details, and commands for AI coding agents working on this codebase.

---

## 🛠️ Tech Stack & Tooling

- **Runtime & Package Manager**: [Bun](https://bun.sh/) (utilizes `bun.lock` for lockfiles, run all scripts with `bun`).
- **Framework**: [Svelte 5](https://svelte.dev/) (uses Svelte 5 runes like `$state` and `$props` for reactivity).
- **Bundler**: [Vite](https://vite.dev/) with [@crxjs/vite-plugin](https://crxjs.dev/) (Manifest V3 support).
- **Linter & Formatter**: [Biome](https://biomejs.dev/) (configured via [biome.json](file:///Users/malolan/Projects/skip-intro/biome.json)).
- **Styling**: [Open Props](https://open-props.style/) (design tokens for CSS variables, such as spacing, shadows, easing, and borders).
- **Language**: TypeScript.

---

## 📁 Key Directories & Architecture

- **`manifest.config.ts`**: The source of truth for the Chrome extension manifest. CRXJS reads this to build the `manifest.json`.
- **`src/common/platforms.ts`**: Defines the supported streaming platforms, their URL patterns, CSS selectors for skip buttons, enablement status, and shortcuts.
- **`src/content/main.ts`**: The content script that runs on all web pages. It listens to keyboard shortcuts and simulates clicking the skip buttons.
- **`src/popup/`**: Contains the popup interface shown when the extension icon is clicked.
  - `App.svelte`: The main entry point.
  - `states/`: Includes state sub-components (`Loading.svelte`, `Found.svelte`, `Unsupported.svelte`).

---

## 🚦 Developer & Agent Instructions

### 1. Code Style and Linters
- **Biome Checks**: Always run Biome check/format before declaring a task complete.
  ```bash
  bun run check  # Runs biome lint and format checks
  bun run fix    # Automatically applies biome fixes and formats
  ```
- **Lint Errors**: Ensure all changes conform to the rules in [biome.json](file:///Users/malolan/Projects/skip-intro/biome.json).

### 2. Svelte 5 Runes
- This project uses Svelte 5. Do **not** use the legacy Svelte 4 reactivity syntax (`let count = 0;` paired with `export let prop;`).
- Use `$state` for component reactive state.
- Use `$props` for component props (e.g., `let { config }: { config: PlatformConfig } = $props();`).
- Make sure components reside in `.svelte` files and modules in `.ts` or `.svelte.ts` files.

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

### 5. Styling & Design Tokens (Open Props)
- Do **not** hardcode values for margins, padding, gap, border radii, border thickness, transition timings, or animations.
- Always use the **Open Props** CSS variable tokens (e.g., `var(--size-2)`, `var(--radius-2)`, `var(--border-size-1)`, `var(--duration-2)`).
- **Scoping in Extension Pages vs. Content Scripts:**
  - Standard variables are imported globally in popup/options pages via [theme.css](file:///Users/malolan/Projects/skip-intro/src/common/theme.css) and attach to `:where(html)`.
  - For injected components (like the overlay), define the exact Open Props variables used directly on the `:host` selector in the component's stylesheet (see [overlay.css](file:///Users/malolan/Projects/skip-intro/src/content/overlay/overlay.css) as a reference). This prevents stylesheet size bloat and avoids polluting the host website's styles.

---

## 💻 Common Commands

| Command | Action |
|---|---|
| `bun install` | Installs dependencies |
| `bun run dev` | Starts Vite dev server with CRXJS hot-reloading |
| `bun run build` | Builds the production package under `/dist` |
| `bun run check` | Checks formatting and code quality with Biome |
| `bun run fix` | Resolves auto-fixable Biome issues |
