import type { VideoControlsConfig } from "@/common/video-controls";
import type { VideoController } from "../video-controller/video-controller";
import OVERLAY_CSS from "./overlay.css?inline";

// ── Public API ──────────────────────────────────────────────────────────────

export type OverlayHandle = {
	/** The host element inserted as a sibling of the video inside its parent. */
	root: HTMLElement;
	/** Programmatically show or hide the overlay (opacity-based, no DOM removal). */
	setHidden(hidden: boolean): void;
	/** Toggle the visibility of the overlay. */
	toggle(): void;
	/** Remove the overlay from the DOM and clean up all event listeners. */
	remove(): void;
};

/**
 * Mounts a Shadow DOM overlay next to `video` inside its parent container.
 * Returns an `OverlayHandle` to control the overlay after mount.
 */
export function createOverlay(
	video: HTMLVideoElement,
	controller: VideoController,
	config: VideoControlsConfig,
	onPositionChange?: (pos: { x: number; y: number }) => void,
): OverlayHandle {
	// ── Host element ──────────────────────────────────────────────────────────
	const host = document.createElement("div");
	positionOverlay(host, video, config);

	// ── Shadow DOM ────────────────────────────────────────────────────────────
	const shadow = host.attachShadow({ mode: "open" });

	const styleEl = document.createElement("style");
	styleEl.textContent = OVERLAY_CSS;
	shadow.appendChild(styleEl);

	// ── Overlay structure ─────────────────────────────────────────────────────
	const overlay = document.createElement("div");
	overlay.className = "si-overlay";

	const dragHandle = document.createElement("span");
	dragHandle.className = "si-drag-handle";
	dragHandle.textContent = "\u22ee\u22ee"; // ⋮⋮ vertical grab dots
	dragHandle.setAttribute("title", "Drag to reposition");

	const speedBadge = document.createElement("span");
	speedBadge.className = "si-speed";
	speedBadge.textContent = formatRate(controller.getPlaybackRate());

	const seekBackBtn = createButton("\u00ab", "");
	seekBackBtn.setAttribute("title", `Seek back ${config.seekSeconds}s`);

	const speedDownBtn = createButton("\u2212", "si-speed-btn");
	speedDownBtn.setAttribute("title", `Decrease speed by ${config.speedStep}`);

	const speedUpBtn = createButton("+", "si-speed-btn");
	speedUpBtn.setAttribute("title", `Increase speed by ${config.speedStep}`);

	const seekFwdBtn = createButton("\u00bb", "");
	seekFwdBtn.setAttribute("title", `Seek forward ${config.seekSeconds}s`);

	const resetSpeedBtn = createButton("x", "si-speed-btn");
	resetSpeedBtn.setAttribute("title", "Reset speed to 1.0");

	overlay.append(
		dragHandle,
		speedBadge,
		seekBackBtn,
		speedDownBtn,
		speedUpBtn,
		seekFwdBtn,
		resetSpeedBtn,
	);
	shadow.appendChild(overlay);

	// ── Seek / speed helpers ──────────────────────────────────────────────────

	function flash(btn: HTMLButtonElement): void {
		btn.classList.add("si-active");
		setTimeout(() => btn.classList.remove("si-active"), 300);
	}

	// ── Button click handlers ─────────────────────────────────────────────────
	speedDownBtn.addEventListener("click", () => {
		const current = controller.getPlaybackRate();
		controller.setPlaybackRate(current - config.speedStep);
		flash(speedDownBtn);
	});
	seekBackBtn.addEventListener("click", () => {
		controller.seek(-config.seekSeconds);
		flash(seekBackBtn);
	});
	seekFwdBtn.addEventListener("click", () => {
		controller.seek(config.seekSeconds);
		flash(seekFwdBtn);
	});
	speedUpBtn.addEventListener("click", () => {
		const current = controller.getPlaybackRate();
		controller.setPlaybackRate(current + config.speedStep);
		flash(speedUpBtn);
	});
	resetSpeedBtn.addEventListener("click", () => {
		controller.setPlaybackRate(1.0);
		flash(resetSpeedBtn);
	});

	// ── Speed badge — live update ─────────────────────────────────────────────
	const unsubscribeRateChange = controller.onPlaybackRateChange((rate) => {
		speedBadge.textContent = formatRate(rate);
	});

	// ── Drag handle event handlers ────────────────────────────────────────────
	let isDragging = false;
	let startX = 0;
	let startY = 0;
	let startLeft = 0;
	let startTop = 0;

	dragHandle.addEventListener("pointerdown", (e) => {
		if (e.button !== 0) return;

		const container = host.parentElement ?? getPlayerContainer(video);
		if (!container) return;

		isDragging = true;
		dragHandle.setPointerCapture(e.pointerId);

		const containerRect = container.getBoundingClientRect();
		const hostRect = host.getBoundingClientRect();

		startLeft = hostRect.left - containerRect.left;
		startTop = hostRect.top - containerRect.top;

		startX = e.clientX;
		startY = e.clientY;

		e.preventDefault();
	});

	dragHandle.addEventListener("pointermove", (e) => {
		if (!isDragging) return;

		const container = host.parentElement ?? getPlayerContainer(video);
		if (!container) return;

		const containerRect = container.getBoundingClientRect();
		const hostRect = host.getBoundingClientRect();

		const deltaX = e.clientX - startX;
		const deltaY = e.clientY - startY;

		let newLeft = startLeft + deltaX;
		let newTop = startTop + deltaY;

		const maxLeft = Math.max(0, containerRect.width - hostRect.width);
		const maxTop = Math.max(0, containerRect.height - hostRect.height);

		newLeft = Math.max(0, Math.min(newLeft, maxLeft));
		newTop = Math.max(0, Math.min(newTop, maxTop));

		host.style.setProperty("left", `${newLeft}px`, "important");
		host.style.setProperty("top", `${newTop}px`, "important");
	});

	dragHandle.addEventListener("pointerup", (e) => {
		if (!isDragging) return;
		isDragging = false;
		dragHandle.releasePointerCapture(e.pointerId);

		const container = host.parentElement ?? getPlayerContainer(video);
		if (!container) return;

		const containerRect = container.getBoundingClientRect();
		const hostRect = host.getBoundingClientRect();

		const leftPx = hostRect.left - containerRect.left;
		const topPx = hostRect.top - containerRect.top;

		const pctX = containerRect.width > 0 ? (leftPx / containerRect.width) * 100 : 0;
		const pctY = containerRect.height > 0 ? (topPx / containerRect.height) * 100 : 0;

		config.position = { x: pctX, y: pctY };

		host.style.setProperty("left", `${pctX}%`, "important");
		host.style.setProperty("top", `${pctY}%`, "important");

		if (onPositionChange) {
			onPositionChange({ x: pctX, y: pctY });
		}
	});

	dragHandle.addEventListener("pointercancel", (e) => {
		if (!isDragging) return;
		isDragging = false;
		dragHandle.releasePointerCapture(e.pointerId);
	});

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
			unsubscribeRateChange();
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
	config: VideoControlsConfig,
): void {
	const container = host.parentElement ?? getPlayerContainer(video);
	const containerPos = getComputedStyle(container).position;
	if (containerPos === "static") {
		container.style.position = "relative";
	}

	host.style.setProperty("position", "absolute", "important");
	if (config.position) {
		host.style.setProperty("left", `${config.position.x}%`, "important");
		host.style.setProperty("top", `${config.position.y}%`, "important");
	} else {
		host.style.setProperty("left", "16px", "important");
		host.style.setProperty("top", "16px", "important");
	}
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
	return rate.toFixed(2);
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
