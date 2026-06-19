import { storage } from "wxt/utils/storage";
import {
	DEFAULT_VIDEO_CONTROLS,
	type VideoControlsConfig,
} from "./video-controls";

export type Settings = {
	videoControls: VideoControlsConfig;
	// Future: per-platform behavior enable/disable overrides go here
};

export const settingsItem = storage.defineItem<Settings>(
	"sync:skip-intro.settings",
	{
		defaultValue: {
			videoControls: DEFAULT_VIDEO_CONTROLS,
		},
	},
);

/**
 * Loads settings from storage, deep-merging any stored values
 * with the current defaults so that new keys are always present even after an
 * extension update adds them.
 */
export async function loadSettings(): Promise<Settings> {
	const raw = await settingsItem.getValue();
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

/** Persists settings to storage. */
export async function saveSettings(s: Settings): Promise<void> {
	await settingsItem.setValue(s);
}
