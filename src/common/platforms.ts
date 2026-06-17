export type StreamingPlatform = "amazon_prime" | "netflix" | "hotstar";

export type PlatformConfig = {
	/** Human-readable display name */
	label: string;
	/** Tested against window.location.hostname */
	urlPattern: RegExp;
	/** Passed to document.querySelector() on keypress */
	skipSelector: string;
	/** When false, the keydown listener ignores this platform */
	enabled: boolean;
	/** Key that triggers the skip (matched against KeyboardEvent.key) */
	shortcutKey: string;
};

export const PLATFORMS: Record<StreamingPlatform, PlatformConfig> = {
	amazon_prime: {
		label: "Amazon Prime Video",
		urlPattern: /primevideo\.com/,
		skipSelector:
			".atvwebplayersdk-action-buttons button.atvwebplayersdk-skipelement-button",
		enabled: true,
		shortcutKey: "s",
	},
	netflix: {
		label: "Netflix",
		urlPattern: /netflix\.com/,
		skipSelector: ".skip-credits button",
		enabled: false,
		shortcutKey: "s",
	},
	hotstar: {
		label: "Disney+ Hotstar",
		urlPattern: /hotstar\.com/,
		skipSelector: 'button[data-testid="skip-intro"]',
		enabled: true,
		shortcutKey: "s",
	},
};

export function detectConfig(hostname: string) {
	return (
		Object.values(PLATFORMS).find(
			({ urlPattern, enabled }) => enabled && urlPattern.test(hostname),
		) ?? null
	);
}
