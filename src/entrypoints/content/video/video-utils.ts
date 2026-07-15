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

export function findVideo(selector?: string): HTMLVideoElement | null {
  if (selector) {
    const el = document.querySelector<HTMLVideoElement>(selector);

    if (el !== null && el instanceof HTMLVideoElement) {
      return el;
    }
  }

  return findLargestVideo();
}

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
