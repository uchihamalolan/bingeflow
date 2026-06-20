export interface VideoController {
	/** Seeks the video by `deltaSeconds` relative to current position. */
	seek(deltaSeconds: number): void;
	/** Sets the playback speed directly. */
	setPlaybackRate(rate: number): void;
	/** Returns the current playback rate. */
	getPlaybackRate(): number;
	/** Returns the current playhead position in seconds. */
	getCurrentTime(): number;
	/** Subscribes to playback rate updates, returning an unsubscribe callback. */
	onPlaybackRateChange(callback: (rate: number) => void): () => void;
	/** Performs cleanups (e.g. event listeners) when the controller is destroyed. */
	destroy(): void;
}
