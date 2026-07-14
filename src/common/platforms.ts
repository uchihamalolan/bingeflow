import { type BehaviorConfig, type BehaviorType, GLOBAL_BEHAVIORS } from "./behaviors";

export type StreamingPlatform = "amazon_prime" | "netflix" | "hotstar";

export type PlatformConfig = {
  label: string;
  platform: StreamingPlatform;
  urlPattern: RegExp;
  /** CSS selector to find the correct <video> on this platform. Falls back to largest-video heuristic if omitted. */
  videoSelector?: string;
  /** CSS selector to find the top-level player container relative to the video. */
  playerContainerSelector?: string;
  /** Per-behavior selector overrides. Only the selector differs from GLOBAL_BEHAVIORS. */
  behaviors: Partial<Record<BehaviorType, { selector: string }>>;
};

export const PLATFORMS: Record<StreamingPlatform, PlatformConfig> = {
  amazon_prime: {
    label: "Amazon Prime Video",
    platform: "amazon_prime",
    urlPattern: /primevideo\.com/,
    videoSelector: "#dv-web-player video",
    playerContainerSelector: "#dv-web-player",
    behaviors: {
      skip: {
        selector: ".atvwebplayersdk-action-buttons button.atvwebplayersdk-skipelement-button",
      },
      next: {
        selector: ".atvwebplayersdk-nextupcard-button, button.atvwebplayersdk-next-up-card",
      },
    },
  },
  netflix: {
    label: "Netflix",
    platform: "netflix",
    urlPattern: /netflix\.com/,
    videoSelector: ".watch-video--player-view video",
    playerContainerSelector: ".watch-video--player-view",
    behaviors: {},
  },
  hotstar: {
    label: "Disney+ Hotstar",
    platform: "hotstar",
    urlPattern: /hotstar\.com/,
    videoSelector: "#video-container video",
    behaviors: {},
  },
};

/**
 * Returns a fully-merged `BehaviorConfig[]` for a given platform by combining
 * global defaults from `GLOBAL_BEHAVIORS` with the platform's selector overrides.
 * Only behavior types that the platform explicitly provides a selector for are included.
 */
export function getPlatformBehaviors(config: PlatformConfig): BehaviorConfig[] {
  return Object.entries(GLOBAL_BEHAVIORS).flatMap(([type, globalDefaults]) => {
    const override = config.behaviors[type as BehaviorType];
    if (!override) return [];
    return [{ ...globalDefaults, selector: override.selector }];
  });
}

/**
 * Returns a set of keyboard shortcuts configured for the active behaviors of the given platform.
 * If the config is null, returns an empty set.
 */
export function getPlatformShortcuts(config: PlatformConfig | null): Set<string> {
  const platformShortcuts = new Set<string>();
  if (config !== null) {
    for (const behavior of getPlatformBehaviors(config)) {
      if (behavior.enabled) {
        platformShortcuts.add(behavior.shortcutKey);
      }
    }
  }
  return platformShortcuts;
}

export function detectConfig(hostname: string): PlatformConfig | null {
  return Object.values(PLATFORMS).find(({ urlPattern }) => urlPattern.test(hostname)) ?? null;
}
