export type BehaviorType = "skip" | "next";

export type BehaviorConfig = {
	type: BehaviorType;
	label: string;
	selector: string;
	shortcutKey: string;
	enabled: boolean;
};

/**
 * Global behavior defaults shared across all platforms.
 * Each platform only needs to supply a `selector` override; everything else
 * is inherited from here.
 */
export const GLOBAL_BEHAVIORS: Record<BehaviorType, Omit<BehaviorConfig, "selector">> = {
	skip: { type: "skip", label: "Skip Intro", shortcutKey: "s", enabled: true },
	next: { type: "next", label: "Next Video", shortcutKey: "n", enabled: true },
};
