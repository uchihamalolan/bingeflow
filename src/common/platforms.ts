export type StreamingPlatform = "amazon_prime" | "netflix" | "hotstar";

export type BehaviorType = "skip" | "next";

export type BehaviorConfig = {
	/** Unique identifier for the behavior */
	type: BehaviorType;
	/** Human-readable display name of the behavior */
	label: string;
	/** Passed to document.querySelector() on keypress */
	selector: string;
	/** Key that triggers the behavior (matched against KeyboardEvent.key) */
	shortcutKey: string;
	/** When false, the keydown listener ignores this behavior */
	enabled: boolean;
};

export type PlatformConfig = {
	/** Human-readable display name */
	label: string;
	/** Tested against window.location.hostname */
	urlPattern: RegExp;
	/** Array of behaviors supported by this platform */
	behaviors: BehaviorConfig[];
};

export const PLATFORMS: Record<StreamingPlatform, PlatformConfig> = {
	amazon_prime: {
		label: "Amazon Prime Video",
		urlPattern: /primevideo\.com/,
		behaviors: [
			{
				type: "skip",
				label: "Skip Intro",
				selector:
					".atvwebplayersdk-action-buttons button.atvwebplayersdk-skipelement-button",
				shortcutKey: "s",
				enabled: true,
			},
			{
				type: "next",
				label: "Next Video",
				selector:
					".atvwebplayersdk-nextupcard-button, button.atvwebplayersdk-next-up-card",
				shortcutKey: "n",
				enabled: true,
			},
		],
	},
	netflix: {
		label: "Netflix",
		urlPattern: /netflix\.com/,
		behaviors: [
			{
				type: "skip",
				label: "Skip Intro",
				selector: ".skip-credits button",
				shortcutKey: "s",
				enabled: false,
			},
			{
				type: "next",
				label: "Next Video",
				selector:
					"button[data-uia='next-episode-seamless-button'], button[data-uia='next-episode-button']",
				shortcutKey: "n",
				enabled: false,
			},
		],
	},
	hotstar: {
		label: "Disney+ Hotstar",
		urlPattern: /hotstar\.com/,
		behaviors: [
			{
				type: "skip",
				label: "Skip Intro",
				selector: 'button[data-testid="skip-intro"]',
				shortcutKey: "s",
				enabled: true,
			},
			{
				type: "next",
				label: "Next Video",
				selector:
					'button[data-testid="next-episode"], button.player-control-next',
				shortcutKey: "n",
				enabled: true,
			},
		],
	},
};

export function detectConfig(hostname: string) {
	return (
		Object.values(PLATFORMS).find(({ urlPattern }) =>
			urlPattern.test(hostname),
		) ?? null
	);
}
