/** Identifies the kind of action a behavior performs. */
export type BehaviorType = "skip" | "next";

/** Full configuration for a single platform behavior. */
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

/**
 * Global behavior defaults shared across all platforms.
 * Each platform only needs to supply a `selector` override; everything else
 * is inherited from here.
 */
export const GLOBAL_BEHAVIORS: Record<
	BehaviorType,
	Omit<BehaviorConfig, "selector">
> = {
	skip: { type: "skip", label: "Skip Intro", shortcutKey: "s", enabled: true },
	next: { type: "next", label: "Next Video", shortcutKey: "n", enabled: true },
};
