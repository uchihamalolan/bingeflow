import type { VideoControlsConfig } from "../common/video-controls";
import OVERLAY_CSS from "./overlay.css?inline";
import { changeSpeed, seek } from "./video-actions";

// ── Public API ──────────────────────────────────────────────────────────────

export type OverlayHandle = {
	/** The host element inserted as a sibling of the video inside its parent. */
	root: HTMLElement;
	/** Programmatically show or hide the overlay (opacity-based, no DOM removal). */
	setHidden: (hidden: boolean) => void;
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

	overlay.append(speedDownBtn, seekBackBtn, speedBadge, seekFwdBtn, speedUpBtn);
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

	// ── Speed badge — live update ─────────────────────────────────────────────
	function onRateChange(): void {
		speedBadge.textContent = formatRate(video.playbackRate);
	}
	video.addEventListener("ratechange", onRateChange);

	// ── Auto-hide ─────────────────────────────────────────────────────────────
	let hideTimer: ReturnType<typeof setTimeout> | null = null;

	function showOverlay(): void {
		overlay.classList.remove("si-hidden");
		if (hideTimer !== null) {
			clearTimeout(hideTimer);
			hideTimer = null;
		}
	}

	function scheduleHide(): void {
		if (hideTimer !== null) clearTimeout(hideTimer);
		hideTimer = setTimeout(() => {
			overlay.classList.add("si-hidden");
			hideTimer = null;
		}, 2000);
	}

	function onMouseEnter(): void {
		showOverlay();
	}

	function onMouseLeave(): void {
		scheduleHide();
	}

	video.addEventListener("mouseenter", onMouseEnter);
	video.addEventListener("mouseleave", onMouseLeave);

	// Initial visibility
	if (config.startHidden) {
		overlay.classList.add("si-hidden");
	} else {
		scheduleHide(); // auto-hide after 2s on first mount
	}

	// ── Mount ─────────────────────────────────────────────────────────────────
	video.parentElement?.appendChild(host);

	// ── Handle ────────────────────────────────────────────────────────────────
	return {
		root: host,

		setHidden(hidden: boolean): void {
			if (hidden) {
				overlay.classList.add("si-hidden");
				if (hideTimer !== null) {
					clearTimeout(hideTimer);
					hideTimer = null;
				}
			} else {
				showOverlay();
			}
		},

		remove(): void {
			video.removeEventListener("ratechange", onRateChange);
			video.removeEventListener("mouseenter", onMouseEnter);
			video.removeEventListener("mouseleave", onMouseLeave);
			if (hideTimer !== null) {
				clearTimeout(hideTimer);
				hideTimer = null;
			}
			host.remove();
		},
	};
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
	const parent = video.parentElement;
	if (parent) {
		const parentPos = getComputedStyle(parent).position;
		if (parentPos === "static") {
			parent.style.position = "relative";
		}
	}

	host.style.position = "absolute";
	host.style.bottom = "16px";
	host.style.left = "50%";
	host.style.transform = "translateX(-50%)";
	host.style.zIndex = "2147483647";
	host.style.pointerEvents = "none";
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
