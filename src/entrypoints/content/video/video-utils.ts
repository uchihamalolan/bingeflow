/**
 * Returns the visible `<video>` element with the largest bounding-box area,
 * or `null` if there are no visible videos on the page.
 */
function findLargestVideo(): HTMLVideoElement | null {
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("video"));

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

/**
 * Finds the best `<video>` element on the page.
 *
 * Priority:
 * 1. Platform-specific `videoSelector` (if the platform config provides one).
 * 2. Largest visible video heuristic (by bounding-box area).
 */
export function findVideo(selector?: string): HTMLVideoElement | null {
  if (selector) {
    const el = document.querySelector<HTMLVideoElement>(selector);

    if (el !== null && el instanceof HTMLVideoElement) {
      return el;
    }
  }

  return findLargestVideo();
}

/**
 * Helper to resolve the best container element for mounting the overlay.
 * If a custom `playerContainerSelector` is provided, it attempts to find the container
 * using `video.closest(playerContainerSelector)`.
 * On most streaming platforms, the video grandparent is the actual player
 * container that holds the video element and the controls overlays.
 */
export function getPlayerContainer(
  video: HTMLVideoElement,
  playerContainerSelector?: string,
): HTMLElement {
  if (playerContainerSelector) {
    const container = video.closest<HTMLElement>(playerContainerSelector);
    if (container) return container;
  }

  const parent = video.parentElement;
  if (!parent) return video;

  const grandparent = parent.parentElement;
  if (!grandparent || grandparent === document.body) return parent;

  return grandparent;
}
