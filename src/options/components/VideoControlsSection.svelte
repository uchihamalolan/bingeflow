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
	border: 1px solid var(--surface0);
	border-radius: 16px;
	padding: 24px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	transition: opacity 0.2s;
}

.section h2 {
	font-size: 18px;
	font-weight: 600;
	margin: 0;
	color: var(--mauve);
}

.setting-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20px;
}

.setting-info {
	display: flex;
	flex-direction: column;
	gap: 4px;
	flex: 1;
}

.setting-label {
	font-size: 15px;
	font-weight: 600;
	color: var(--text);
}

.setting-desc {
	font-size: 13px;
	color: var(--subtext0);
}

.disabled {
	opacity: 0.45;
	pointer-events: none;
}
</style>
