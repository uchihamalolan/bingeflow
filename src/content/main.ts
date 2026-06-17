import { PLATFORMS } from "./platforms";

function detectConfig(hostname: string) {
	return (
		Object.values(PLATFORMS).find(
			({ urlPattern, enabled }) => enabled && urlPattern.test(hostname),
		) ?? null
	);
}

document.addEventListener("keydown", (e: KeyboardEvent) => {
	if (e.key !== "s") return;
	const config = detectConfig(window.location.hostname);
	if (!config) return;
	document.querySelector<HTMLElement>(config.skipSelector)?.click();
});
