import {
	DEFAULT_VIDEO_CONTROLS,
	type VideoControlsConfig,
} from "./video-controls";

export type Settings = {
	videoControls: VideoControlsConfig;
	// Future: per-platform behavior enable/disable overrides go here
};

const STORAGE_KEY = "skip-intro.settings";

/**
 * Loads settings from `chrome.storage.sync`, deep-merging any stored values
 * with the current defaults so that new keys are always present even after an
 * extension update adds them.
 */
export async function loadSettings(): Promise<Settings> {
	const stored = await chrome.storage.sync.get(STORAGE_KEY);
	const raw = stored[STORAGE_KEY] as Partial<Settings> | undefined;

	if (!raw) {
		return { videoControls: DEFAULT_VIDEO_CONTROLS };
	}

	return {
		videoControls: {
			...DEFAULT_VIDEO_CONTROLS,
			...raw.videoControls,
			// keyBindings is a nested object so it needs its own spread
			keyBindings: {
				...DEFAULT_VIDEO_CONTROLS.keyBindings,
				...raw.videoControls?.keyBindings,
			},
		},
	};
}

/** Persists settings to `chrome.storage.sync`. */
export async function saveSettings(s: Settings): Promise<void> {
	await chrome.storage.sync.set({ [STORAGE_KEY]: s });
}
