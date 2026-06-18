import type { BehaviorConfig } from "./behaviors";

export type StreamingPlatform = "amazon_prime" | "netflix" | "hotstar";

export type PlatformConfig = {
	label: string;
	urlPattern: RegExp;
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
