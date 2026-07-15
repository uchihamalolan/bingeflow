import { browser } from "wxt/browser";

import { Html5VideoController } from "./html5-video-controller";

export class NetflixVideoController extends Html5VideoController {
  constructor(video: HTMLVideoElement) {
    super(video);
    this.injectBridge();
  }

  override seek(deltaSeconds: number): void {
    const targetSeconds = Math.max(
      0,
      Math.min(this.video.duration || 0, this.video.currentTime + deltaSeconds),
    );

    window.dispatchEvent(
      new CustomEvent("bingeflow:netflix:seek", {
        detail: JSON.stringify({ targetTimeMs: targetSeconds * 1000 }),
      }),
    );
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
