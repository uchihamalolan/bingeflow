/** Configuration for the floating video-controls overlay. */
export type VideoControlsConfig = {
	/** Master switch: when false the overlay is never mounted. */
	enabled: boolean;
	/** Seconds to seek backward / forward per button press. Default: 5 */
	seekSeconds: number;
	/** Playback-rate increment / decrement per button press. Default: 0.25 */
	speedStep: number;
	/** When true the overlay starts invisible until the user mouses over the video. Default: false */
	startHidden: boolean;
	keyBindings: {
		/** Default: "z" */
		seekBack: string;
		/** Default: "x" */
		seekFwd: string;
		/** Default: "q" */
		speedDown: string;
		/** Default: "w" */
		speedUp: string;
	};
};

export const DEFAULT_VIDEO_CONTROLS: VideoControlsConfig = {
	enabled: true,
	seekSeconds: 5,
	speedStep: 0.25,
	startHidden: false,
	keyBindings: { seekBack: "z", seekFwd: "x", speedDown: "q", speedUp: "w" },
};
