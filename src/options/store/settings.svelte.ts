import { loadSettings, type Settings } from "../../common/settings";

function createSettingsStore() {
	let current = $state<Settings | null>(null);

	return {
		get current() {
			return current;
		},
		set current(value) {
			current = value;
		},
		async init() {
			current = await loadSettings();
		},
	};
}

export const settings = createSettingsStore();
