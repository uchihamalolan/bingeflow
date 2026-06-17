export type StreamingPlatform = "amazon_prime" | "netflix" | "hotstar";

export type PlatformConfig = {
	/** Tested against window.location.hostname */
	urlPattern: RegExp;
	/** Passed to document.querySelector() on keypress */
	skipSelector: string;
	/** When false, the keydown listener ignores this platform */
	enabled: boolean;
};

export const PLATFORMS: Record<StreamingPlatform, PlatformConfig> = {
	amazon_prime: {
		urlPattern: /primevideo\.com/,
		skipSelector: ".skipelement",
		enabled: true,
	},
	netflix: {
		urlPattern: /netflix\.com/,
		skipSelector: ".skip-credits button",
		enabled: false,
	},
	hotstar: {
		urlPattern: /hotstar\.com/,
		skipSelector: 'button[data-testid="skip-intro"]',
		enabled: true,
	},
};
