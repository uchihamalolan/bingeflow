import type { PlatformConfig } from "@/common/platforms";
import type { VideoControlsConfig } from "@/common/video-controls";

import { createOverlay, type OverlayHandle, positionOverlay } from "../overlay/overlay";
import { createVideoController } from "../video-controller/create-video-controller";
import type { VideoController } from "../video-controller/video-controller";
import { findVideo, getPlayerContainer } from "./video-utils";

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
  private config: VideoControlsConfig;
  private readonly platformConfig: PlatformConfig | null;

  private activeVideo: HTMLVideoElement | null = null;
  private activeController: VideoController | null = null;
  private overlayHandle: OverlayHandle | null = null;

  private readonly mutationObserver: MutationObserver;
  private readonly resizeObserver: ResizeObserver;

  constructor(config: VideoControlsConfig, platformConfig: PlatformConfig | null) {
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

  getConfig(): VideoControlsConfig {
    return this.config;
  }

  /** Updates the configuration and handles mounting/unmounting accordingly. */
  updateConfig(newConfig: VideoControlsConfig): void {
    const wasEnabled = this.config.enabled;
    const nowEnabled = newConfig.enabled;
    this.config = newConfig;

    if (wasEnabled && !nowEnabled) {
      this.unmount();
    } else if (!wasEnabled && nowEnabled) {
      this.scan();
    }
  }

  getVideo(): HTMLVideoElement | null {
    return this.activeVideo;
  }

  getController(): VideoController | null {
    return this.activeController;
  }

  destroy(): void {
    this.mutationObserver.disconnect();
    this.resizeObserver.disconnect();
    this.unmount();
  }

  toggleOverlay(): void {
    this.overlayHandle?.toggle();
  }

  triggerActivity(): void {
    this.overlayHandle?.triggerActivity();
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
          (node instanceof Element && this.activeVideo !== null && node.contains(this.activeVideo))
        ) {
          needsScan = true;
          break outer;
        }
      }
    }

    if (needsScan) this.scan();
  }

  private onResize(): void {
    if (this.overlayHandle !== null) {
      positionOverlay(this.overlayHandle.root);
    }
  }

  private scan(): void {
    const found = findVideo(this.platformConfig?.videoSelector);

    // Nothing changed — skip
    if (found === this.activeVideo) return;

    // Tear down what was previously mounted (sets this.activeVideo = null)
    this.unmount();

    if (found !== null && this.config.enabled) {
      this.activeVideo = found;
      this.mount(found);
    }
  }

  private mount(video: HTMLVideoElement): void {
    const controller = createVideoController(video, this.platformConfig);
    this.activeController = controller;

    const playerContainer = getPlayerContainer(video, this.platformConfig?.playerContainerSelector);

    this.overlayHandle = createOverlay(controller, this.config, playerContainer);
    this.resizeObserver.observe(video);
  }

  private unmount(): void {
    this.overlayHandle?.remove();
    this.overlayHandle = null;

    this.activeController?.destroy();
    this.activeController = null;

    if (this.activeVideo !== null) {
      this.resizeObserver.unobserve(this.activeVideo);
      this.activeVideo = null;
    }
  }
}
