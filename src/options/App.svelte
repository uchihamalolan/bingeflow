<script lang="ts">
import { onMount } from "svelte";
import Toast from "../common/components/Toast.svelte";
import { saveSettings } from "../common/settings";
import { theme } from "../common/store/theme.svelte";
import Header from "./components/Header.svelte";
import KeyboardShortcutsSection from "./components/KeyboardShortcutsSection.svelte";
import LoadingState from "./components/LoadingState.svelte";
import VideoControlsSection from "./components/VideoControlsSection.svelte";
import { settings } from "./settings.svelte";

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
			<VideoControlsSection
				bind:videoControls={settings.current.videoControls}
				onchange={triggerSave}
			/>
			<KeyboardShortcutsSection
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
	max-width: 560px;
	display: flex;
	flex-direction: column;
	gap: var(--size-6);
}

.main-content {
	display: flex;
	flex-direction: column;
	gap: var(--size-6);
}
</style>
