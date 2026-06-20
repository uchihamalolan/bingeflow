import { defineContentScript } from "wxt/utils/define-content-script";

import { detectConfig, getPlatformBehaviors } from "~/common/platforms";
import { loadSettings, saveSettings } from "~/common/settings";
import { isValidPress } from "~/content/utils/validpress";
import { changeSpeed, seek } from "~/content/video/video-actions";
import { VideoManager } from "~/content/video/video-manager";

export default defineContentScript({
	matches: ["https://*/*"],
	async main() {
		const settings = await loadSettings();
		const platformConfig = detectConfig(window.location.hostname);
		const videoManager = new VideoManager(
			settings.videoControls,
			platformConfig,
			async (pos) => {
				settings.videoControls.position = pos;
				await saveSettings(settings);
			},
		);

		const { keyBindings, seekSeconds, speedStep } = settings.videoControls;

		// Pre-compute active platform shortcuts to handle conflicts
		const platformShortcuts = new Set<string>();
		if (platformConfig !== null) {
			for (const behavior of getPlatformBehaviors(platformConfig)) {
				if (behavior.enabled) {
					platformShortcuts.add(behavior.shortcutKey);
				}
			}
		}

		document.addEventListener("keydown", (e: KeyboardEvent) => {
			if (!isValidPress(e)) return;

			// ── Video-control shortcuts ─────────────────────────────────────────────
			const video = videoManager.getVideo();

			// If a key conflicts with a platform shortcut, we yield to the platform action.
			if (video !== null && !platformShortcuts.has(e.key)) {
				if (e.key.toLowerCase() === "v") {
					videoManager.toggleOverlay();
					return;
				}
				if (e.key === keyBindings.seekBack) {
					seek(video, -seekSeconds);
					return;
				}
				if (e.key === keyBindings.seekFwd) {
					seek(video, seekSeconds);
					return;
				}
				if (e.key === keyBindings.speedDown) {
					changeSpeed(video, -speedStep);
					return;
				}
				if (e.key === keyBindings.speedUp) {
					changeSpeed(video, speedStep);
					return;
				}
				if (e.key === keyBindings.resetSpeed) {
					video.playbackRate = 1.0;
					return;
				}
			}

			// ── Platform-behavior shortcuts (skip-intro, next-episode, …) ──────────
			if (platformConfig === null) return;

			for (const behavior of getPlatformBehaviors(platformConfig)) {
				if (behavior.enabled && e.key === behavior.shortcutKey) {
					document.querySelector<HTMLElement>(behavior.selector)?.click();
					break;
				}
			}
		});
	},
});
