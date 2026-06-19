<script lang="ts">
import type { VideoControlsConfig } from "~/common/video-controls";
import { DEFAULT_VIDEO_CONTROLS } from "~/common/video-controls";
import KbdButton from "./KbdButton.svelte";
import ResetButton from "./ResetButton.svelte";

interface Props {
	videoControls: VideoControlsConfig;
	onchange: () => void;
}

let {
	videoControls = $bindable(),
	onchange,
}: Props = $props();

let activeRebindKey = $state<keyof VideoControlsConfig["keyBindings"] | null>(
	null,
);

function handleKeydown(event: KeyboardEvent) {
	if (!activeRebindKey) return;
	event.preventDefault();
	event.stopPropagation();

	if (event.key === "Escape") {
		activeRebindKey = null;
		return;
	}

	// Ignore modifier-only keydowns
	if (["Control", "Shift", "Alt", "Meta"].includes(event.key)) {
		return;
	}

	videoControls.keyBindings[activeRebindKey] = event.key;
	activeRebindKey = null;
	onchange();
}

function startRebind(key: keyof VideoControlsConfig["keyBindings"]) {
	activeRebindKey = key;
}

function resetKey(key: keyof VideoControlsConfig["keyBindings"]) {
	videoControls.keyBindings[key] = DEFAULT_VIDEO_CONTROLS.keyBindings[key];
	onchange();
}

function formatKey(key: string): string {
	if (key === " ") return "Space";
	if (key.length === 1) return key.toUpperCase();
	return key;
}

type BindingKey = keyof VideoControlsConfig["keyBindings"];

const shortcutConfigs: { id: BindingKey; label: string }[] = [
	{ id: "seekBack", label: "Seek Backward" },
	{ id: "seekFwd", label: "Seek Forward" },
	{ id: "speedDown", label: "Decrease Speed" },
	{ id: "speedUp", label: "Increase Speed" },
	{ id: "resetSpeed", label: "Reset Speed" },
];
</script>

<!-- biome-ignore lint/a11y/noStaticElementInteractions: svelte:window is a special tag for window events -->
<svelte:window onkeydown={handleKeydown} />

<article class="section" class:disabled={!videoControls.enabled}>
	<h2 class="section-title">Keyboard Shortcuts</h2>

	<dl class="shortcut-list">
		{#each shortcutConfigs as { id, label }}
			<div class="shortcut-item">
				<dt class="shortcut-label">{label}</dt>
				<dd class="shortcut-actions">
					<KbdButton
						active={activeRebindKey === id}
						disabled={!videoControls.enabled}
						value={formatKey(videoControls.keyBindings[id])}
						onclick={() => startRebind(id)}
					/>
					<ResetButton
						disabled={!videoControls.enabled || videoControls.keyBindings[id] === DEFAULT_VIDEO_CONTROLS.keyBindings[id]}
						onclick={() => resetKey(id)}
					/>
				</dd>
			</div>
		{/each}
	</dl>
</article>

<style>
.section {
	background: var(--mantle);
	border: var(--border-size-1) solid var(--surface0);
	border-radius: var(--radius-4);
	padding: var(--size-6);
	display: flex;
	flex-direction: column;
	gap: var(--size-5);
	box-shadow: var(--shadow-2);
}

.section-title {
	margin: 0;
	color: var(--mauve);
}

.shortcut-list {
	display: flex;
	flex-direction: column;
	gap: var(--size-3);
}

.shortcut-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-block: var(--size-2);
	border-bottom: var(--border-size-1) solid var(--surface0);

	&:last-child {
		border-bottom: none;
	}
}

.shortcut-label {
	font-weight: var(--font-weight-5);
}

.shortcut-actions {
	display: flex;
	align-items: center;
	gap: var(--size-3);
}

.disabled {
	opacity: 0.45;
	pointer-events: none;
}
</style>
