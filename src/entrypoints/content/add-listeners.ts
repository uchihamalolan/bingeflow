import { getPlatformBehaviors, type PlatformConfig } from "@/common/platforms";
import type { VideoControlsConfig } from "@/common/video-controls";
import { isValidPress } from "./utils/validpress";
import type { VideoManager } from "./video/video-manager";

interface Props {
	videoManager: VideoManager;
	videoControls: VideoControlsConfig;
	platformConfig: PlatformConfig | null;
	platformShortcuts: Set<string>;
}

export function addEventListeners({
	videoManager,
	platformConfig,
	videoControls,
	platformShortcuts,
}: Props) {
	const { keyBindings, seekSeconds, speedStep } = videoControls;

	document.addEventListener("keydown", (e: KeyboardEvent) => {
		if (!isValidPress(e)) return;

		// ── Video-control shortcuts ─────────────────────────────────────────────
		const controller = videoManager.getController();

		// If a key conflicts with a platform shortcut, we yield to the platform action.
		if (controller !== null && !platformShortcuts.has(e.key)) {
			if (e.key.toLowerCase() === "v") {
				videoManager.toggleOverlay();
				return;
			}
			if (e.key === keyBindings.seekBack) {
				controller.seek(-seekSeconds);
				return;
			}
			if (e.key === keyBindings.seekFwd) {
				controller.seek(seekSeconds);
				return;
			}
			if (e.key === keyBindings.speedDown) {
				const current = controller.getPlaybackRate();
				controller.setPlaybackRate(current - speedStep);
				return;
			}
			if (e.key === keyBindings.speedUp) {
				const current = controller.getPlaybackRate();
				controller.setPlaybackRate(current + speedStep);
				return;
			}
			if (e.key === keyBindings.resetSpeed) {
				controller.setPlaybackRate(1.0);
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
}
