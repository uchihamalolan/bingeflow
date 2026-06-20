/** Seeks the video by `delta` seconds, clamped to [0, duration]. */
export function seek(video: HTMLVideoElement, delta: number): void {
	video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + delta));
}

/** Changes playback rate by `delta`, clamped to [0.1, 16]. */
export function changeSpeed(video: HTMLVideoElement, delta: number): void {
	const next = Math.round((video.playbackRate + delta) * 100) / 100;
	video.playbackRate = Math.max(0.1, Math.min(16, next));
}
