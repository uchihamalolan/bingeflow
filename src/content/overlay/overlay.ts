import type { VideoControlsConfig } from "../../common/video-controls";
import { changeSpeed, seek } from "../video/video-actions";
import OVERLAY_CSS from "./overlay.css?inline";

// ── Public API ──────────────────────────────────────────────────────────────

export type OverlayHandle = {
	/** The host element inserted as a sibling of the video inside its parent. */
	root: HTMLElement;
	/** Programmatically show or hide the overlay (opacity-based, no DOM removal). */
	setHidden: (hidden: boolean) => void;
	/** Toggle the visibility of the overlay. */
	toggle: () => void;
	/** Remove the overlay from the DOM and clean up all event listeners. */
	remove: () => void;
};

/**
 * Mounts a Shadow DOM overlay next to `video` inside its parent container.
 * Returns an `OverlayHandle` to control the overlay after mount.
 */
export function createOverlay(
	video: HTMLVideoElement,
	config: VideoControlsConfig,
): OverlayHandle {
	// ── Host element ──────────────────────────────────────────────────────────
	const host = document.createElement("div");
	positionOverlay(host, video);

	// ── Shadow DOM ────────────────────────────────────────────────────────────
	const shadow = host.attachShadow({ mode: "open" });

	const styleEl = document.createElement("style");
	styleEl.textContent = OVERLAY_CSS;
	shadow.appendChild(styleEl);

	// ── Overlay structure ─────────────────────────────────────────────────────
	const overlay = document.createElement("div");
	overlay.className = "si-overlay";

	const speedDownBtn = createButton(`\u22120.25\u00d7`, "si-speed-btn");
	const seekBackBtn = createButton(`\u2212${config.seekSeconds}s`, "");
	const speedBadge = document.createElement("span");
	speedBadge.className = "si-speed";
	speedBadge.textContent = formatRate(video.playbackRate);
	const seekFwdBtn = createButton(`+${config.seekSeconds}s`, "");
	const speedUpBtn = createButton(`+0.25\u00d7`, "si-speed-btn");
	const resetSpeedBtn = createButton("1\u00d7", "si-speed-btn");

	overlay.append(
		speedDownBtn,
		seekBackBtn,
		speedBadge,
		seekFwdBtn,
		speedUpBtn,
		resetSpeedBtn,
	);
	shadow.appendChild(overlay);

	// ── Seek / speed helpers (imported from video-actions) ───────────────────

	function flash(btn: HTMLButtonElement): void {
		btn.classList.add("si-active");
		setTimeout(() => btn.classList.remove("si-active"), 300);
	}

	// ── Button click handlers ─────────────────────────────────────────────────
	speedDownBtn.addEventListener("click", () => {
		changeSpeed(video, -config.speedStep);
		flash(speedDownBtn);
	});
	seekBackBtn.addEventListener("click", () => {
		seek(video, -config.seekSeconds);
		flash(seekBackBtn);
	});
	seekFwdBtn.addEventListener("click", () => {
		seek(video, config.seekSeconds);
		flash(seekFwdBtn);
	});
	speedUpBtn.addEventListener("click", () => {
		changeSpeed(video, config.speedStep);
		flash(speedUpBtn);
	});
	resetSpeedBtn.addEventListener("click", () => {
		video.playbackRate = 1.0;
		flash(resetSpeedBtn);
	});

	// ── Speed badge — live update ─────────────────────────────────────────────
	function onRateChange(): void {
		speedBadge.textContent = formatRate(video.playbackRate);
	}
	video.addEventListener("ratechange", onRateChange);

	// ── Visibility State & Listeners ──────────────────────────────────────────
	const mouseTarget = getPlayerContainer(video);
	let isHidden = config.startHidden;

	function showOverlay(): void {
		overlay.classList.remove("si-hidden");
	}

	function hideOverlay(): void {
		overlay.classList.add("si-hidden");
	}

	// Initial visibility
	if (isHidden) {
		hideOverlay();
	} else {
		showOverlay();
	}

	// ── Mount ─────────────────────────────────────────────────────────────────
	mouseTarget.appendChild(host);

	// ── Handle ────────────────────────────────────────────────────────────────
	return {
		root: host,

		setHidden(hidden: boolean): void {
			isHidden = hidden;
			if (hidden) {
				hideOverlay();
			} else {
				showOverlay();
			}
		},

		toggle(): void {
			isHidden = !isHidden;
			if (isHidden) {
				hideOverlay();
			} else {
				showOverlay();
			}
		},

		remove(): void {
			video.removeEventListener("ratechange", onRateChange);
			host.remove();
		},
	};
}

/**
 * Helper to resolve the best container element for mounting the overlay.
 * On most streaming platforms, the video grandparent is the actual player
 * container that holds the video element and the controls overlays.
 */
function getPlayerContainer(video: HTMLVideoElement): HTMLElement {
	const parent = video.parentElement;
	if (!parent) return video;

	const grandparent = parent.parentElement;
	if (!grandparent || grandparent === document.body) {
		return parent;
	}

	return grandparent;
}

/**
 * Applies the absolute-positioning styles to `host` and ensures the video's
 * parent container is positioned (so `position: absolute` on `host` works).
 * Safe to call multiple times (idempotent).
 */
export function positionOverlay(
	host: HTMLElement,
	video: HTMLVideoElement,
): void {
	const container = host.parentElement ?? getPlayerContainer(video);
	const containerPos = getComputedStyle(container).position;
	if (containerPos === "static") {
		container.style.position = "relative";
	}

	host.style.setProperty("position", "absolute", "important");
	host.style.setProperty("top", "16px", "important");
	host.style.setProperty("left", "16px", "important");
	host.style.setProperty("bottom", "auto", "important");
	host.style.setProperty("transform", "none", "important");
	host.style.setProperty("z-index", "2147483647", "important");
	host.style.setProperty("pointer-events", "none", "important");
	host.style.setProperty("width", "max-content", "important");
	host.style.setProperty("display", "block", "important");
	host.style.setProperty("align-self", "flex-start", "important");
	host.style.setProperty("justify-self", "start", "important");
}

// ── Private helpers ──────────────────────────────────────────────────────────

function createButton(label: string, extraClass: string): HTMLButtonElement {
	const btn = document.createElement("button");
	btn.className = extraClass ? `si-btn ${extraClass}` : "si-btn";
	btn.textContent = label;
	return btn;
}

function formatRate(rate: number): string {
	return `${rate.toFixed(2)}\u00d7`;
}
