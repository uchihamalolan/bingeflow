# Changelog

All notable changes to BingeFlow are documented in this file.

The format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [0.1.0] — 2026-08-02

### Added

- **Gamepad & Controller Support**: Full Bluetooth/USB gamepad input with configurable bindings for seeking, playback speed adjustment, skipping intros/recaps, play/pause, and next-episode actions.
- **Per-Site Domain Controls**: Selectively enable or disable BingeFlow features per streaming domain (Netflix, Prime Video, Disney+, Hotstar, YouTube) from the popup and options interfaces.
- **Gamepad Options Interface**: Interactive `GamepadShortcuts` options component with real-time input recording (`useGamepadRecorder`).
- **Comprehensive Unit & Integration Test Suite**: 38 Vitest test suites (96 tests total) using Solid Testing Library and User Event simulation covering popup, options, content scripts, hardware listeners, and utility helpers.
- **Dynamic Player Controls Overlay**: Responsive Shadow DOM player overlay with autohide, drag handling, and Catppuccin theme styling.
- **Internationalization (i18n)**: Comprehensive locale support for extension UI strings.
- **Privacy Policy & Developer Guides**: Added `PRIVACY.md`, architectural decision records (`DECISIONS.md`), and developer onboarding guide (`DEVELOPMENT.md`).

### Changed

- **Tooling Configurations**: Consolidated configuration files under `configs/` (`uno.config.ts`, `oxlint.config.ts`, `oxfmt.config.ts`, `vitest.config.ts`).
- **Enhanced CX Class Utilities**: Upgraded `cx.ts` to process `ClassValue` via `clsx` for category styling blocks.
- **UnoCSS Shortcuts**: Extracted reusable component style patterns into `configs/uno.config.ts` shortcuts.
- **Options Layout**: Implemented responsive masonry column layout for settings cards.

### Fixed

- **Netflix Rapid Seeking Fix**: Virtual target seek-time accumulator in `NetflixVideoController` to prevent seeking loops and player state desynchronization on rapid keypresses.
- **Main-World Netflix Bridge**: Injection via `web_accessible_resources` (`netflix-bridge.ts`) to bypass Netflix CSP rules and safely interact with internal player APIs.
- **DOM Security & i18n Safety**: Replaced `innerHTML` usages with safe DOM manipulation and added optional chaining for `browser.i18n.getMessage`.
