<script lang="ts">
import { onMount } from "svelte";
import type { Settings } from "../common/settings";
import { loadSettings, saveSettings } from "../common/settings";

import Header from "./components/Header.svelte";
import KeyboardShortcutsSection from "./components/KeyboardShortcutsSection.svelte";
import LoadingState from "./components/LoadingState.svelte";
import Toast from "./components/Toast.svelte";
import VideoControlsSection from "./components/VideoControlsSection.svelte";

let settings = $state<Settings | null>(null);
let theme = $state<"frappe" | "latte">("frappe");
let saveStatus = $state<"idle" | "saving" | "saved">("idle");

let saveTimeout: number;
let toastTimeout: number;

onMount(async () => {
	settings = await loadSettings();

	const storedTheme = await chrome.storage.local.get("skip-intro.theme");
	if (storedTheme["skip-intro.theme"] === "latte") {
		theme = "latte";
	} else {
		theme = "frappe";
	}
	document.documentElement.setAttribute("data-theme", theme);
});

function toggleTheme() {
	theme = theme === "frappe" ? "latte" : "frappe";
	document.documentElement.setAttribute("data-theme", theme);
	chrome.storage.local.set({ "skip-intro.theme": theme });
}

function triggerSave() {
	if (!settings) return;
	const currentSettings = settings;
	saveStatus = "saving";
	window.clearTimeout(saveTimeout);
	saveTimeout = window.setTimeout(async () => {
		await saveSettings($state.snapshot(currentSettings));
		saveStatus = "saved";
		window.clearTimeout(toastTimeout);
		toastTimeout = window.setTimeout(() => {
			saveStatus = "idle";
		}, 2000);
	}, 500);
}
</script>

{#if settings}
	<div class="container">
		<Header {theme} ontoggle={toggleTheme} />

		<main class="main-content">
			<VideoControlsSection bind:videoControls={settings.videoControls} onchange={triggerSave} />
			<KeyboardShortcutsSection bind:videoControls={settings.videoControls} onchange={triggerSave} />
		</main>
	</div>

	<Toast {saveStatus} />
{:else}
	<LoadingState />
{/if}

<style>
:global(html) {
	background-color: var(--base);
	color: var(--text);
	font-family:
		-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
		sans-serif;
	transition:
		background-color var(--duration-2) var(--ease-2),
		color var(--duration-2) var(--ease-2);
	display: flex;
	justify-content: center;
	padding: var(--size-8) var(--size-5);
	box-sizing: border-box;
	min-height: 100%;
}

:global(body) {
	margin: 0;
	padding: 0;
	width: 100%;
}

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
