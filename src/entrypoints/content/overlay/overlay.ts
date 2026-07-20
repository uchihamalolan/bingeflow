import { getMessage } from "@/common/browser";
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
  /** Reset the autohide timer (e.g. on keyboard action). */
  triggerActivity(): void;
  /** Remove the overlay from the DOM and clean up all event listeners. */
  remove(): void;
};

const svgString = {
  seekBack: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><!-- Icon from Phosphor by Phosphor Icons - https://github.com/phosphor-icons/core/blob/main/LICENSE --><path fill="currentColor" d="M232 184a8 8 0 0 1-16 0a88 88 0 0 0-150.22-62.22L43.4 144H88a8 8 0 0 1 0 16H24a8 8 0 0 1-8-8V88a8 8 0 0 1 16 0v44.77l22.48-22.33A104 104 0 0 1 232 184"/></svg>`,
  seekForward: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><!-- Icon from Phosphor by Phosphor Icons - https://github.com/phosphor-icons/core/blob/main/LICENSE --><path fill="currentColor" d="M240 88v64a8 8 0 0 1-8 8h-64a8 8 0 0 1 0-16h44.6l-22.36-22.21A88 88 0 0 0 40 184a8 8 0 0 1-16 0a104 104 0 0 1 177.54-73.54L224 132.77V88a8 8 0 0 1 16 0"/></svg>`,
  speedUp: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><!-- Icon from Phosphor by Phosphor Icons - https://github.com/phosphor-icons/core/blob/main/LICENSE --><path fill="currentColor" d="M248.67 114.66L160.48 58.5A15.91 15.91 0 0 0 136 71.84v37.3L56.48 58.5A15.91 15.91 0 0 0 32 71.84v112.32a15.92 15.92 0 0 0 24.48 13.34L136 146.86v37.3a15.92 15.92 0 0 0 24.48 13.34l88.19-56.16a15.8 15.8 0 0 0 0-26.68M48 183.94V72.07L135.82 128Zm104 0V72.07L239.82 128Z"/></svg>`,
  speedDown: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><!-- Icon from Phosphor by Phosphor Icons - https://github.com/phosphor-icons/core/blob/main/LICENSE --><path fill="currentColor" d="M223.77 58a16 16 0 0 0-16.25.53L128 109.14v-37.3a15.91 15.91 0 0 0-24.48-13.34l-88.19 56.16a15.8 15.8 0 0 0 0 26.68l88.19 56.16A15.91 15.91 0 0 0 128 184.16v-37.3l79.52 50.64A15.91 15.91 0 0 0 232 184.16V71.84A15.83 15.83 0 0 0 223.77 58M112 183.93L24.18 128L112 72.06Zm104 0L128.18 128L216 72.06Z"/></svg>`,
  speedReset: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><!-- Icon from Phosphor by Phosphor Icons - https://github.com/phosphor-icons/core/blob/main/LICENSE --><path fill="currentColor" d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/></svg>`,
};

/**
 * Mounts a Shadow DOM overlay next to `video` inside its parent container.
 * Returns an `OverlayHandle` to control the overlay after mount.
 */
export function createOverlay(
  controller: VideoController,
  config: VideoControlsConfig,
  playerContainer: HTMLElement,
): OverlayHandle {
  // ── Host element ──────────────────────────────────────────────────────────
  const host = document.createElement("div");
  playerContainer.appendChild(host);
  positionOverlay(host);

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
  dragHandle.setAttribute("title", getMessage("overlayDragTooltip"));

  const speedBadge = document.createElement("span");
  speedBadge.className = "si-speed";
  speedBadge.textContent = formatRate(controller.getPlaybackRate());

  const seekBackBtn = createButton(svgString.seekBack);
  seekBackBtn.setAttribute("title", getMessage("overlaySeekBackTooltip", String(config.seekSeconds)));

  const speedDownBtn = createButton(svgString.speedDown);
  speedDownBtn.setAttribute("title", getMessage("overlayDecreaseSpeedTooltip", String(config.speedStep)));

  const speedUpBtn = createButton(svgString.speedUp);
  speedUpBtn.setAttribute("title", getMessage("overlayIncreaseSpeedTooltip", String(config.speedStep)));

  const seekFwdBtn = createButton(svgString.seekForward);
  seekFwdBtn.setAttribute("title", getMessage("overlaySeekForwardTooltip", String(config.seekSeconds)));

  const resetSpeedBtn = createButton(svgString.speedReset);
  resetSpeedBtn.setAttribute("title", getMessage("overlayResetSpeedTooltip"));

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

  // ── Button click handlers ─────────────────────────────────────────────────
  speedDownBtn.addEventListener("click", () => {
    const current = controller.getPlaybackRate();
    controller.setPlaybackRate(current - config.speedStep);
  });
  seekBackBtn.addEventListener("click", () => {
    controller.seek(-config.seekSeconds);
  });
  seekFwdBtn.addEventListener("click", () => {
    controller.seek(config.seekSeconds);
  });
  speedUpBtn.addEventListener("click", () => {
    const current = controller.getPlaybackRate();
    controller.setPlaybackRate(current + config.speedStep);
  });
  resetSpeedBtn.addEventListener("click", () => {
    controller.setPlaybackRate(1.0);
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

    const container = host.parentElement;
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

    const container = host.parentElement;
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

    const container = host.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const hostRect = host.getBoundingClientRect();

    const leftPx = hostRect.left - containerRect.left;
    const topPx = hostRect.top - containerRect.top;

    const pctX = containerRect.width > 0 ? (leftPx / containerRect.width) * 100 : 0;
    const pctY = containerRect.height > 0 ? (topPx / containerRect.height) * 100 : 0;

    host.style.setProperty("left", `${pctX}%`, "important");
    host.style.setProperty("top", `${pctY}%`, "important");
  });

  dragHandle.addEventListener("pointercancel", (e) => {
    if (!isDragging) return;
    isDragging = false;
    dragHandle.releasePointerCapture(e.pointerId);
  });

  // ── Visibility State & Listeners ──────────────────────────────────────────
  let isHidden = config.startHidden;
  let autohideTimeout: ReturnType<typeof setTimeout> | null = null;

  function showOverlay(): void {
    overlay.classList.remove("si-hidden");
  }

  function hideOverlay(): void {
    overlay.classList.add("si-hidden");
  }

  function resetAutohideTimer(): void {
    if (autohideTimeout) {
      clearTimeout(autohideTimeout);
      autohideTimeout = null;
    }

    if (!isHidden) {
      showOverlay();
    }

    autohideTimeout = setTimeout(() => {
      if (!isHidden && !isDragging) {
        hideOverlay();
      }
    }, 5000);
  }

  // Listen to pointer movements on the document to reset timer/show overlay
  document.addEventListener("pointermove", resetAutohideTimer, { capture: true });

  // Initial visibility
  if (isHidden) {
    hideOverlay();
  } else {
    resetAutohideTimer();
  }

  // ── Handle ────────────────────────────────────────────────────────────────
  return {
    root: host,

    setHidden(hidden: boolean): void {
      isHidden = hidden;
      if (hidden) {
        if (autohideTimeout) {
          clearTimeout(autohideTimeout);
          autohideTimeout = null;
        }
        hideOverlay();
      } else {
        resetAutohideTimer();
      }
    },

    toggle(): void {
      isHidden = !isHidden;
      if (isHidden) {
        if (autohideTimeout) {
          clearTimeout(autohideTimeout);
          autohideTimeout = null;
        }
        hideOverlay();
      } else {
        resetAutohideTimer();
      }
    },

    triggerActivity(): void {
      resetAutohideTimer();
    },

    remove(): void {
      if (autohideTimeout) {
        clearTimeout(autohideTimeout);
      }
      document.removeEventListener("pointermove", resetAutohideTimer, { capture: true });
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
export function positionOverlay(host: HTMLElement): void {
  const container = host.parentElement;
  if (!container) return;

  host.style.setProperty("position", "absolute", "important");
  // Only apply default left/top if they have not been set (e.g. by dragging)
  if (!host.style.left) {
    host.style.setProperty("left", "8px", "important");
    host.style.setProperty("top", "8px", "important");
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

function createButton(svg: string): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.className = "si-btn";
  btn.innerHTML = svg;
  return btn;
}

function formatRate(rate: number): string {
  return rate.toFixed(2);
}
