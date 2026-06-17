import { detectConfig } from "../common/platforms";
import { isValidPress } from "./validpress";

document.addEventListener("keydown", (e: KeyboardEvent) => {
	if (!isValidPress(e)) return;

	const config = detectConfig(window.location.hostname);
	if (!config) return;

	for (const behavior of config.behaviors) {
		if (behavior.enabled && e.key === behavior.shortcutKey) {
			document.querySelector<HTMLElement>(behavior.selector)?.click();
			break;
		}
	}
});
