import { Html5VideoController } from "./html5-video-controller";
import netflixBridge from "./netflix-bridge.js?raw";

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
			new CustomEvent("skip-intro:netflix:seek", {
				detail: { targetTimeMs: targetSeconds * 1000 },
			}),
		);
	}

	override setPlaybackRate(rate: number): void {
		const speed = Math.max(0.1, Math.min(16, rate));

		window.dispatchEvent(
			new CustomEvent("skip-intro:netflix:set-speed", {
				detail: { rate: speed },
			}),
		);
	}

	private injectBridge(): void {
		const BRIDGE_ID = "skip-intro-netflix-bridge";
		if (document.getElementById(BRIDGE_ID)) return;

		const script = document.createElement("script");
		script.id = BRIDGE_ID;
		script.textContent = netflixBridge;
		(document.head || document.documentElement).appendChild(script);
	}
}
