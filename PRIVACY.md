# Privacy Policy for BingeFlow

Last updated: 2026-06-23

BingeFlow ("we", "our", or "us") provides a browser extension designed to skip intros, recaps, and credits, and control video playback speed on streaming platforms. We are committed to protecting your privacy.

This privacy policy explains how we handle data and what information is processed when you use BingeFlow.

## 1. No Collection of Personal Data
BingeFlow **does not collect, store, or transmit any personally identifiable information (PII)**, such as your name, email address, IP address, location, search queries, or browsing history. All data generated and processed by the extension remains strictly on your local device.

## 2. Permissions and Data Use
To provide its functionality, the extension requests the following permissions. Here is how they are used:
* **`storage`**: Used exclusively to save and retrieve your custom settings (such as seek duration, playback speed increment step, overlay visibility configuration, and custom keyboard shortcuts) and theme choice (Frappe or Latte). 
  * Options settings are saved using the browser's `sync` storage API (meaning they synchronize across devices where you are logged into your browser profile).
  * UI theme preferences are saved locally on your device.
* **`tabs`**: Used strictly when you open the extension popup to query the active tab's URL/hostname. This is required so the popup can determine if the active tab is a supported streaming platform (Netflix, Amazon Prime Video, or Disney+ Hotstar) and show the corresponding settings.
* **Host Matches (`https://*/*`)**: Used to inject content scripts into pages with video players so that:
  1. The floating video controls overlay can be attached to any HTML5 video player.
  2. Platform-specific skip/next buttons can be automatically detected and activated.
  No URL or webpage content is ever saved or sent off your device.

## 3. Remote Code Prohibition
BingeFlow does not load, run, or execute any remotely hosted scripts or code. All logic, Svelte 5 components, and configurations are fully compiled and bundled locally within the extension package.

## 4. Third-Party Services
BingeFlow does not integrate with any third-party services, analytics providers, or tracking systems. We do not use cookies or tracking pixels.

## 5. Security and Data Retention
Since all preferences and configurations are stored in your browser's local or sync storage, they are retained until you:
* Clear your browser data/storage.
* Uninstall the extension.
Your preference data is secured by the security measures of your browser and operating system.

## 6. Policy Changes
We may update this Privacy Policy from time to time. Any changes will be reflected by updating the "Last updated" date at the top of this document. We encourage users to check this page periodically for updates.

## 7. Contact
If you have any questions or feedback regarding this Privacy Policy or BingeFlow, please open an issue on our repository:
[BingeFlow Issues](https://codeberg.org/ma101an/bingeflow/issues)
