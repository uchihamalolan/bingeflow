import { browser } from "wxt/browser";

import { Html5VideoController } from "./html5-video-controller";

export class NetflixVideoController extends Html5VideoController {
  private targetSeekTime: number | null = null;
  private seekTimeoutId: ReturnType<typeof setTimeout> | null = null;

  private onSeeked = () => {
    if (this.targetSeekTime !== null) {
      const hasReachedTarget =
        Math.abs(this.video.currentTime - this.targetSeekTime) < 1.0;
      if (hasReachedTarget) {
        this.targetSeekTime = null;
        this.clearSeekTimeout();
      }
    }
  };

  constructor(video: HTMLVideoElement) {
    super(video);
    this.injectBridge();
    this.video.addEventListener("seeked", this.onSeeked);
  }

  override seek(deltaSeconds: number): void {
    const baseTime = this.targetSeekTime ?? this.video.currentTime;
    const targetSeconds = Math.max(
      0,
      Math.min(this.video.duration ?? 0, baseTime + deltaSeconds),
    );
    this.targetSeekTime = targetSeconds;

    this.clearSeekTimeout();
    this.seekTimeoutId = setTimeout(() => {
      this.targetSeekTime = null;
      this.seekTimeoutId = null;
    }, 1500);

    window.dispatchEvent(
      new CustomEvent("bingeflow:netflix:seek", {
        detail: JSON.stringify({ targetTimeMs: targetSeconds * 1000 }),
      }),
    );
  }

  override destroy(): void {
    super.destroy();
    this.video.removeEventListener("seeked", this.onSeeked);
    this.clearSeekTimeout();
  }

  private clearSeekTimeout(): void {
    if (this.seekTimeoutId) {
      clearTimeout(this.seekTimeoutId);
      this.seekTimeoutId = null;
    }
  }

  private injectBridge(): void {
    const BRIDGE_ID = "bingeflow-netflix-bridge";
    if (document.getElementById(BRIDGE_ID)) return;

    const script = document.createElement("script");
    script.id = BRIDGE_ID;
    script.src = browser.runtime.getURL("/netflix-bridge.js");
    (document.head || document.documentElement).appendChild(script);
  }
}
