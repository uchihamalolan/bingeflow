<script lang="ts">
import { onMount } from "svelte";
import Toast from "../common/components/Toast.svelte";
import { saveSettings } from "../common/settings";
import { theme } from "../common/store/theme.svelte";
import Header from "./components/Header.svelte";
import KeyboardShortcuts from "./components/KeyboardShortcuts.svelte";
import LoadingState from "./components/LoadingState.svelte";
import VideoControls from "./components/VideoControls.svelte";
import { settings } from "./store/settings.svelte";

let saveStatus = $state<"idle" | "success" | "error">("idle");

onMount(async () => {
	await Promise.all([theme.init(), settings.init()]);
});

async function triggerSave() {
	if (!settings.current) return;

	try {
		await saveSettings($state.snapshot(settings.current));
		saveStatus = "success";
	} catch (error) {
		console.error("Failed to save settings:", error);
		saveStatus = "error";
	}

	setTimeout(() => {
		saveStatus = "idle";
	}, 2000);
}
</script>

{#if settings.current}
	<div class="container">
		<Header />

		<main class="main-content">
			<VideoControls
				bind:videoControls={settings.current.videoControls}
				onchange={triggerSave}
			/>
			<KeyboardShortcuts
				bind:videoControls={settings.current.videoControls}
				onchange={triggerSave}
			/>
		</main>
	</div>

	<Toast {saveStatus} />
{:else}
	<LoadingState />
{/if}

<style>
.container {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: var(--size-6);
}

.main-content {
	display: grid;
	grid-template-columns: 1fr;
	gap: var(--size-6);
	align-items: start;
}

@media (min-width: 768px) {
	.main-content {
		grid-template-columns: repeat(2, 1fr);
	}
}
</style>
