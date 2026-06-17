import { detectConfig } from "../common/platforms";

document.addEventListener("keydown", (e: KeyboardEvent) => {
	const config = detectConfig(window.location.hostname);
	if (!config) return;
	if (e.key !== config.shortcutKey) return;
	document.querySelector<HTMLElement>(config.skipSelector)?.click();
});
