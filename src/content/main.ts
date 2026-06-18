import { detectConfig, getPlatformBehaviors } from "../common/platforms";
import { loadSettings } from "../common/settings";
import { isValidPress } from "./validpress";
import { changeSpeed, seek } from "./video-actions";
import { VideoManager } from "./video-manager";

// Bootstrap asynchronously so we can await settings from storage
(async () => {
	const settings = await loadSettings();
	const platformConfig = detectConfig(window.location.hostname);
	const videoManager = new VideoManager(settings.videoControls, platformConfig);

	const { keyBindings, seekSeconds, speedStep } = settings.videoControls;

	document.addEventListener("keydown", (e: KeyboardEvent) => {
		if (!isValidPress(e)) return;

		// ── Video-control shortcuts ─────────────────────────────────────────────
		const video = videoManager.getVideo();

		if (video !== null) {
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
			// Speed-up yields to platform behaviors when on a recognised
			// streaming platform, in case the user has bound speedUp to a key
			// that also triggers a platform action (e.g. skip-intro).
			if (e.key === keyBindings.speedUp && platformConfig === null) {
				changeSpeed(video, speedStep);
				return;
			}
			// If we are on a streaming platform and the key is speedUp, fall
			// through to the platform-behavior handler below.
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
})();
