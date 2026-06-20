import type { VideoController } from "./video-controller";

export class Html5VideoController implements VideoController {
	private rateListeners = new Set<(rate: number) => void>();
	private onRateChangeEvent = () => {
		const rate = this.getPlaybackRate();
		for (const listener of this.rateListeners) {
			listener(rate);
		}
	};

	constructor(protected video: HTMLVideoElement) {
		this.video.addEventListener("ratechange", this.onRateChangeEvent);
	}

	seek(deltaSeconds: number): void {
		const target = this.video.currentTime + deltaSeconds;
		this.video.currentTime = Math.max(0, Math.min(this.video.duration || 0, target));
	}

	setPlaybackRate(rate: number): void {
		const speed = Math.max(0.1, Math.min(16, rate));
		this.video.playbackRate = speed;
	}

	getPlaybackRate(): number {
		return this.video.playbackRate;
	}

	getCurrentTime(): number {
		return this.video.currentTime;
	}

	onPlaybackRateChange(callback: (rate: number) => void): () => void {
		this.rateListeners.add(callback);
		// Call immediately with initial value
		callback(this.getPlaybackRate());

		return () => {
			this.rateListeners.delete(callback);
		};
	}

	destroy(): void {
		this.video.removeEventListener("ratechange", this.onRateChangeEvent);
		this.rateListeners.clear();
	}
}
