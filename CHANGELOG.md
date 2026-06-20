# Release Notes

## v1.0.0 - 2026-06-21

### 🚀 Enhancements

- Define platforms configuration and set up content script base (e3c92fb)
- Implement extension popup and loading/unsupported states (10fedce)
- Add settings behaviors, license, and ignore keystrokes in input elements (4f4ec14)
- Add configurable video skip and auto-skip behaviors (9fd6a12)
- Allow platform configurations to override behaviors from settings (adc4be2)
- Add keyboard shortcut settings and video controls options (f005e18)
- Add UI overlay for active platform indicators (e1d53b7)
- Implement video manager to handle HTML5 video playback actions (7d55cf9)
- Add options page and bootstrap layout styling (87899d0)
- Integrate Catppuccin color theme and theme state store (26a0d52)
- Add video settings controls for speed, skip time, and mute on skip (2035f06)
- Add setting to reset playback speed when skip occurs (63fc50b)
- Add drag handle to overlay for custom positioning (b86f312)
- Save custom overlay position to local storage when moved (2c72204)
- Integrate Open Props for CSS custom properties styling (a084549)
- Enhance popup aesthetics with consistent margins and status indicators (0d07334)
- Enable theme switching on options page (ac42bd6)
- Add support for Netflix with dedicated bridge and controller injection (7004481)

### 🩹 Fixes

- Resolve overlay layout, position, and styling issues (6af9f63)
- Resolve overlay visibility and mouse event propagation issues (d45327c)
- Correct layout spacing, alignment, and hover effects in popup (a30d2a5)
- Fix type check and layout errors in settings page (dd1ddf4)
- Prevent playback rate modification on Netflix video player (2f3d190)
- Adjust overlay positioning and clean up platforms config (fb563fe)

### 💅 Refactors

- Add logger utility and clean up input validation (1d2b88b)
- Restructure files and clean up popup styling (68c8ba7)
- Convert UI colors and spacing to Open Props CSS variables (f9ad9e1)
- Clean up options page layout and remove redundant styles (86910e2)
- Optimize popup components and simplify state management (011110a)
- Reorganize folder structure under src/entrypoints (75abf00)
- Simplify theme storage and configure Biome linter (40bc9c1)
- Rename popup state views directory to views (926d7df)
- Wrap extension storage calls with browser namespace utility (c6ed9a7)
- Optimize browser storage helpers for options and settings (0ec770b)
- Standardize local storage calls across theme and extension APIs (eed2c75)
- Restructure content scripts, listener management, and video utilities (0a64db4)
- Move logger utility to common/utils (c39b12d)
- Remove persistent overlay position storage (8f10956)

### 📖 Documentation

- Add coding guidelines in AGENTS.md and update README (4136cc9)
- Update changelog and extension manifest version (8a0d929)
- Update development guidelines in AGENTS.md (0f1fb17)

### 🏡 Chore

- Initialize repository with Vite, Svelte, and Biome (3a199c7)
- Adjust tsconfig and entrypoints for popup compilation (c525615)
- Add extension icons and update manifest configuration (9e8a8cd)
- Clean up dependencies and typescript configurations (ce58adb)
- Update extension manifest with background, options, and content script permissions (0d1d982)
- Add build output directory and update typescript configuration (8120324)
- Migrate project build and bundling toolchain to WXT (ad75359)
- Update dependencies and typescript definition for WXT (1aa4989)
- Update package dependencies and content script messaging (7a89dd4)
- Add Firefox telemetry metadata configuration (eeefb58)
- Configure PostCSS with custom media queries in WXT (50ff608)
- Use defu for merging default settings configuration (e6c92d4)

### 🎨 Styles

- Format popup codebase using Biome (88ed857)
- Make overlay semi-transparent and apply glassmorphism style (a764abc)
- Adopt CSS nesting format in stylesheets (b0e7354)
- Remove unused CSS rules from layout and options (d2fe1b7)
- Format sources and update formatting rules in biome.json (951899f)

### ❤️ Contributors

- Malolan B ([@uchihamalolan](https://github.com/uchihamalolan))

## Notes to Reviewer

### Test Steps
1. **Popup & Hostname Detection**:
   - Open a page on **Netflix**, **Amazon Prime Video**, or **Disney+ Hotstar**.
   - Click the extension popup icon. The popup should correctly detect the active streaming platform and display its current behavior settings.
2. **Options Navigation**:
   - Click the gear/settings icon in the top-right corner of the extension popup. It will open the Options page (`src/options/index.html`).
3. **Settings Customization**:
   - Change the theme toggle (sun/moon icon) to switch between **Frappe** and **Latte** Catppuccin modes.
   - Adjust "Seek Duration" or "Playback Speed Step" and verify the green "Saved ✓" toast notification displays.
   - Click a keyboard shortcut key button, press a new key to rebind it (including the new "Reset Speed" shortcut), and check that the key updates.
   - Click the reset button to restore a keybind to its default key.
4. **Video Playback & Controls Overlay**:
   - Open a playback page on any supported streaming site.
   - The floating controls overlay will appear (or remain hidden if "Start Hidden" is checked).
   - Use the buttons on the overlay (including the new `1×` button) or the customized keyboard shortcuts (press `r` to reset speed to 1x) to control seeking and playback speeds.

### Permission Justifications
- `storage`: Essential to persist user-configured keybindings, overlay preferences (enabled, seek duration, speed steps, default visibility), and preferred color theme.
- `tabs`: Required to read the URL hostname of the current active tab to detect supported streaming platforms in the popup.

### Privacy Policy Compliance
- **No Remote Calls**: The extension operates entirely locally on the user's browser.
- **No Data Harvesting**: No user credentials, cookies, usage metrics, or page information are ever read, stored, or sent to external servers.
