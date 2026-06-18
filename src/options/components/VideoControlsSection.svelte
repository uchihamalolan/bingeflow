<script lang="ts">
import NumberInput from "../../common/components/NumberInput.svelte";
import Switch from "../../common/components/Switch.svelte";
import type { VideoControlsConfig } from "../../common/video-controls";

let {
	videoControls = $bindable(),
	onchange,
}: {
	videoControls: VideoControlsConfig;
	onchange: () => void;
} = $props();
</script>

<section class="section">
	<h2>Video Controls</h2>

	<div class="setting-row">
		<div class="setting-info">
			<span class="setting-label">Enable Overlay</span>
			<span class="setting-desc"
				>Show the floating video controls overlay on pages with video
				elements</span
			>
		</div>
		<Switch
			id="enabled-toggle"
			ariaLabel="Enable Overlay"
			bind:checked={videoControls.enabled}
			{onchange}
		/>
	</div>

	<div
		class="setting-row"
		class:disabled={!videoControls.enabled}
	>
		<div class="setting-info">
			<span class="setting-label">Seek Duration</span>
			<span class="setting-desc"
				>Seconds to seek forward or backward</span
			>
		</div>
		<NumberInput
			bind:value={videoControls.seekSeconds}
			disabled={!videoControls.enabled}
			min={1}
			max={60}
			step={1}
			unit="s"
			{onchange}
		/>
	</div>

	<div
		class="setting-row"
		class:disabled={!videoControls.enabled}
	>
		<div class="setting-info">
			<span class="setting-label">Playback Speed Step</span>
			<span class="setting-desc"
				>Playback-rate increment or decrement per button click</span
			>
		</div>
		<NumberInput
			bind:value={videoControls.speedStep}
			disabled={!videoControls.enabled}
			min={0.05}
			max={2.0}
			step={0.05}
			unit="×"
			{onchange}
		/>
	</div>

	<div
		class="setting-row"
		class:disabled={!videoControls.enabled}
	>
		<div class="setting-info">
			<span class="setting-label">Start Hidden</span>
			<span class="setting-desc"
				>Hide the overlay by default until mouse activity is detected near
				the video</span
			>
		</div>
		<Switch
			id="start-hidden-toggle"
			ariaLabel="Start Hidden"
			bind:checked={videoControls.startHidden}
			disabled={!videoControls.enabled}
			{onchange}
		/>
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
}

.section h2 {
	font-size: var(--font-size-2);
	font-weight: var(--font-weight-6);
	margin: 0;
	color: var(--mauve);
}

.setting-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--size-5);
}

.setting-info {
	display: flex;
	flex-direction: column;
	gap: var(--size-1);
	flex: 1;
}

.setting-label {
	font-size: var(--font-size-1);
	font-weight: var(--font-weight-6);
	color: var(--text);
}

.setting-desc {
	font-size: var(--font-size-0);
	color: var(--subtext0);
}

.disabled {
	opacity: 0.45;
	pointer-events: none;
}
</style>
