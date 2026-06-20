import { getPlatformBehaviors, type PlatformConfig } from "@/common/platforms";
import type { VideoControlsConfig } from "@/common/video-controls";
import { isValidPress } from "./utils/validpress";
import { changeSpeed, seek } from "./video/video-actions";
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
}
