# Release Notes

## Version 1.0.0 - 2026-06-18

### Added
- **Options Settings Page**: Created a dedicated options page (`src/options/`) for customizing extension preferences.
  - Choose between Catppuccin **Frappe** (dark) and **Latte** (light) color themes.
  - Toggle the floating video controls overlay.
  - Set custom seek durations (1 to 60 seconds).
  - Set custom playback speed step increments (0.05× to 2.0×).
  - Configure options to start the video control overlay in a hidden state.
  - Rebind and reset default keyboard shortcut keybindings for seek back/forward and speed up/down controls.
- **Settings Navigation**: Added a direct shortcut button in the popup header to easily launch the settings options page.
- **Extended Platform Support**: Supported platforms now include:
  - Netflix (`netflix.com`)
  - Disney+ Hotstar (`hotstar.com`)
  - Amazon Prime Video (`primevideo.com`)
- **Shared Components**: Extracted clean, reusable Svelte 5 component UI structures (`Spinner`, `Switch`, `NumberInput`) under `src/common/components/`.

### Refactored
- Modularized options layout by refactoring the monolithic `App.svelte` options file into separate, single-responsibility components (`Header`, `VideoControlsSection`, `KeyboardShortcutsSection`, `Toast`, `LoadingState`).
- Standardized the popup loader to reuse the new common `Spinner.svelte`.

---

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
   - Click a keyboard shortcut key button, press a new key to rebind it, and check that the key updates.
   - Click the reset button to restore a keybind to its default key.
4. **Video Playback & Controls Overlay**:
   - Open a playback page on any supported streaming site.
   - The floating controls overlay will appear (or remain hidden if "Start Hidden" is checked).
   - Use the buttons on the overlay or the customized keyboard shortcuts to control seeking and playback speeds.

### Permission Justifications
- `storage`: Essential to persist user-configured keybindings, overlay preferences (enabled, seek duration, speed steps, default visibility), and preferred color theme.
- `tabs`: Required to read the URL hostname of the current active tab to detect supported streaming platforms in the popup.

### Privacy Policy Compliance
- **No Remote Calls**: The extension operates entirely locally on the user's browser.
- **No Data Harvesting**: No user credentials, cookies, usage metrics, or page information are ever read, stored, or sent to external servers.
