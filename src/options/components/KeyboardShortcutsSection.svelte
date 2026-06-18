<script lang="ts">
import type { VideoControlsConfig } from "../../common/video-controls";
import { DEFAULT_VIDEO_CONTROLS } from "../../common/video-controls";

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
</script>

<!-- biome-ignore lint/a11y/noStaticElementInteractions: svelte:window is a special tag for window events -->
<svelte:window onkeydown={handleKeydown} />

<section class="section" class:disabled={!videoControls.enabled}>
	<h2>Keyboard Shortcuts</h2>

	<div class="shortcut-row">
		<span class="shortcut-label">Seek Backward</span>
		<div class="shortcut-actions">
			<button
				type="button"
				class="kbd-btn"
				class:active={activeRebindKey === "seekBack"}
				disabled={!videoControls.enabled}
				onclick={() => startRebind("seekBack")}
			>
				{activeRebindKey === "seekBack" ? "Press key..." : formatKey(videoControls.keyBindings.seekBack)}
			</button>
			<button
				type="button"
				class="reset-btn"
				disabled={!videoControls.enabled || videoControls.keyBindings.seekBack === DEFAULT_VIDEO_CONTROLS.keyBindings.seekBack}
				onclick={() => resetKey("seekBack")}
				title="Reset to default"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="icon"
				>
					<title>Reset to default</title>
					<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
					<path d="M3 3v5h5" />
				</svg>
			</button>
		</div>
	</div>

	<div class="shortcut-row">
		<span class="shortcut-label">Seek Forward</span>
		<div class="shortcut-actions">
			<button
				type="button"
				class="kbd-btn"
				class:active={activeRebindKey === "seekFwd"}
				disabled={!videoControls.enabled}
				onclick={() => startRebind("seekFwd")}
			>
				{activeRebindKey === "seekFwd" ? "Press key..." : formatKey(videoControls.keyBindings.seekFwd)}
			</button>
			<button
				type="button"
				class="reset-btn"
				disabled={!videoControls.enabled || videoControls.keyBindings.seekFwd === DEFAULT_VIDEO_CONTROLS.keyBindings.seekFwd}
				onclick={() => resetKey("seekFwd")}
				title="Reset to default"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="icon"
				>
					<title>Reset to default</title>
					<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
					<path d="M3 3v5h5" />
				</svg>
			</button>
		</div>
	</div>

	<div class="shortcut-row">
		<span class="shortcut-label">Decrease Speed</span>
		<div class="shortcut-actions">
			<button
				type="button"
				class="kbd-btn"
				class:active={activeRebindKey === "speedDown"}
				disabled={!videoControls.enabled}
				onclick={() => startRebind("speedDown")}
			>
				{activeRebindKey === "speedDown" ? "Press key..." : formatKey(videoControls.keyBindings.speedDown)}
			</button>
			<button
				type="button"
				class="reset-btn"
				disabled={!videoControls.enabled || videoControls.keyBindings.speedDown === DEFAULT_VIDEO_CONTROLS.keyBindings.speedDown}
				onclick={() => resetKey("speedDown")}
				title="Reset to default"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="icon"
				>
					<title>Reset to default</title>
					<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
					<path d="M3 3v5h5" />
				</svg>
			</button>
		</div>
	</div>

	<div class="shortcut-row">
		<span class="shortcut-label">Increase Speed</span>
		<div class="shortcut-actions">
			<button
				type="button"
				class="kbd-btn"
				class:active={activeRebindKey === "speedUp"}
				disabled={!videoControls.enabled}
				onclick={() => startRebind("speedUp")}
			>
				{activeRebindKey === "speedUp" ? "Press key..." : formatKey(videoControls.keyBindings.speedUp)}
			</button>
			<button
				type="button"
				class="reset-btn"
				disabled={!videoControls.enabled || videoControls.keyBindings.speedUp === DEFAULT_VIDEO_CONTROLS.keyBindings.speedUp}
				onclick={() => resetKey("speedUp")}
				title="Reset to default"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="icon"
				>
					<title>Reset to default</title>
					<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
					<path d="M3 3v5h5" />
				</svg>
			</button>
		</div>
	</div>

	<div class="shortcut-row">
		<span class="shortcut-label">Reset Speed</span>
		<div class="shortcut-actions">
			<button
				type="button"
				class="kbd-btn"
				class:active={activeRebindKey === "resetSpeed"}
				disabled={!videoControls.enabled}
				onclick={() => startRebind("resetSpeed")}
			>
				{activeRebindKey === "resetSpeed" ? "Press key..." : formatKey(videoControls.keyBindings.resetSpeed)}
			</button>
			<button
				type="button"
				class="reset-btn"
				disabled={!videoControls.enabled || videoControls.keyBindings.resetSpeed === DEFAULT_VIDEO_CONTROLS.keyBindings.resetSpeed}
				onclick={() => resetKey("resetSpeed")}
				title="Reset to default"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="icon"
				>
					<title>Reset to default</title>
					<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
					<path d="M3 3v5h5" />
				</svg>
			</button>
		</div>
	</div>
</section>

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
	transition: opacity var(--duration-2) var(--ease-2);

	h2 {
		font-size: var(--font-size-2);
		font-weight: var(--font-weight-6);
		margin: 0;
		color: var(--mauve);
	}
}

.shortcut-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: var(--size-2) 0;
	border-bottom: var(--border-size-1) solid var(--surface0);

	&:last-of-type {
		border-bottom: none;
	}
}

.shortcut-label {
	font-size: var(--font-size-1);
	font-weight: var(--font-weight-5);
}

.shortcut-actions {
	display: flex;
	align-items: center;
	gap: var(--size-3);
}

.kbd-btn {
	background: var(--surface0);
	border: var(--border-size-1) solid var(--surface1);
	color: var(--blue);
	font-family: inherit;
	font-size: var(--font-size-0);
	font-weight: var(--font-weight-7);
	padding: var(--size-1) var(--size-4);
	border-radius: var(--radius-2);
	cursor: pointer;
	min-width: 80px;
	text-align: center;
	transition: all var(--duration-2) var(--ease-2);
	border-bottom-width: var(--border-size-2);

	&:hover:not(:disabled) {
		background: var(--surface1);
		border-color: var(--surface2);
		color: var(--text);
	}

	&.active {
		background: rgba(202, 158, 230, 0.1);
		border-color: var(--mauve);
		color: var(--mauve);
		animation: pulse 1.5s infinite;
	}
}

.reset-btn {
	background: transparent;
	border: var(--border-size-1) solid transparent;
	color: var(--subtext0);
	width: var(--size-7);
	height: var(--size-7);
	border-radius: var(--radius-2);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all var(--duration-2) var(--ease-2);

	&:hover:not(:disabled) {
		background: var(--surface0);
		border-color: var(--surface1);
		color: var(--red);
	}

	&:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.icon {
		width: 16px;
		height: 16px;
	}
}

@keyframes pulse {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0.6;
	}
	100% {
		opacity: 1;
	}
}

.disabled {
	opacity: 0.45;
	pointer-events: none;
}
</style>
