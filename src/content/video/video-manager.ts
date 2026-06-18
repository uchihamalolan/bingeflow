import type { PlatformConfig } from "../../common/platforms";
import type { VideoControlsConfig } from "../../common/video-controls";
import {
	createOverlay,
	type OverlayHandle,
	positionOverlay,
} from "../overlay/overlay";

/**
 * Manages the lifecycle of the video-controls overlay for a single page.
 *
 * - Watches the DOM via `MutationObserver` for `<video>` elements appearing
 *   and disappearing.
 * - Mounts/unmounts the overlay accordingly.
 * - Watches the active video via `ResizeObserver` to keep the overlay host's
 *   positioning styles in sync when the video resizes.
 */
export class VideoManager {
	private readonly config: VideoControlsConfig;
	private readonly platformConfig: PlatformConfig | null;

	private activeVideo: HTMLVideoElement | null = null;
	private overlayHandle: OverlayHandle | null = null;

	private readonly mutationObserver: MutationObserver;
	private readonly resizeObserver: ResizeObserver;

	constructor(
		config: VideoControlsConfig,
		platformConfig: PlatformConfig | null,
	) {
		this.config = config;
		this.platformConfig = platformConfig;

		this.mutationObserver = new MutationObserver(this.onMutation.bind(this));
		this.resizeObserver = new ResizeObserver(this.onResize.bind(this));

		// Observe the whole document for video additions / removals
		this.mutationObserver.observe(document.documentElement, {
			childList: true,
			subtree: true,
		});

		// Handle any video already present in the DOM at construction time
		this.scan();
	}

	/** Returns the currently tracked video element, or `null` if none. */
	getVideo(): HTMLVideoElement | null {
		return this.activeVideo;
	}

	/** Tears down all observers and removes the overlay from the DOM. */
	destroy(): void {
		this.mutationObserver.disconnect();
		this.resizeObserver.disconnect();
		this.unmount();
	}

	/** Toggles the visibility of the overlay if it is mounted. */
	toggleOverlay(): void {
		this.overlayHandle?.toggle();
	}

	// ── Private ────────────────────────────────────────────────────────────────

	private onMutation(records: MutationRecord[]): void {
		let needsScan = false;

		outer: for (const record of records) {
			// A new node was added — check if it is or contains a <video>
			for (const node of record.addedNodes) {
				if (
					node instanceof HTMLVideoElement ||
					(node instanceof Element && node.querySelector("video") !== null)
				) {
					needsScan = true;
					break outer;
				}
			}
			// A node was removed — check if it is or contains our active video
			for (const node of record.removedNodes) {
				if (
					node === this.activeVideo ||
					(node instanceof Element &&
						this.activeVideo !== null &&
						node.contains(this.activeVideo))
				) {
					needsScan = true;
					break outer;
				}
			}
		}

		if (needsScan) this.scan();
	}

	private onResize(): void {
		if (this.overlayHandle !== null && this.activeVideo !== null) {
			positionOverlay(this.overlayHandle.root, this.activeVideo);
		}
	}

	/**
	 * Finds the best video candidate and mounts or unmounts the overlay as
	 * needed. A no-op if the best candidate has not changed.
	 */
	private scan(): void {
		const found = this.findVideo();

		// Nothing changed — skip
		if (found === this.activeVideo) return;

		// Tear down what was previously mounted (sets this.activeVideo = null)
		this.unmount();

		if (found !== null && this.config.enabled) {
			this.activeVideo = found;
			this.mount(found);
		}
	}

	/**
	 * Finds the best `<video>` element on the page.
	 *
	 * Priority:
	 * 1. Platform-specific `videoSelector` (if the platform config provides one).
	 * 2. Largest visible video heuristic (by bounding-box area).
	 */
	private findVideo(): HTMLVideoElement | null {
		const selector = this.platformConfig?.videoSelector;
		if (selector) {
			const el = document.querySelector<HTMLVideoElement>(selector);
			if (el !== null) return el;
		}

		return findLargestVideo();
	}

	private mount(video: HTMLVideoElement): void {
		this.overlayHandle = createOverlay(video, this.config);
		this.resizeObserver.observe(video);
	}

	private unmount(): void {
		this.overlayHandle?.remove();
		this.overlayHandle = null;

		if (this.activeVideo !== null) {
			this.resizeObserver.unobserve(this.activeVideo);
			this.activeVideo = null;
		}
	}
}

// ── Module-private helpers ───────────────────────────────────────────────────

/**
 * Returns the visible `<video>` element with the largest bounding-box area,
 * or `null` if there are no visible videos on the page.
 */
function findLargestVideo(): HTMLVideoElement | null {
	const videos = Array.from(
		document.querySelectorAll<HTMLVideoElement>("video"),
	);

	let best: HTMLVideoElement | null = null;
	let bestArea = 0;

	for (const video of videos) {
		const { width, height } = video.getBoundingClientRect();
		const area = width * height;
		if (area > bestArea) {
			bestArea = area;
			best = video;
		}
	}

	return best;
}
