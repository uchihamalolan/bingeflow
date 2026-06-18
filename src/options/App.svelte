<script lang="ts">
import { onMount } from "svelte";
import type { Settings } from "../common/settings";
import { loadSettings, saveSettings } from "../common/settings";
import type { VideoControlsConfig } from "../common/video-controls";
import { DEFAULT_VIDEO_CONTROLS } from "../common/video-controls";

let settings = $state<Settings | null>(null);
let theme = $state<"frappe" | "latte">("frappe");
let activeRebindKey = $state<keyof VideoControlsConfig["keyBindings"] | null>(
	null,
);
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

function handleKeydown(event: KeyboardEvent) {
	if (!activeRebindKey || !settings) return;
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

	settings.videoControls.keyBindings[activeRebindKey] = event.key;
	activeRebindKey = null;
	triggerSave();
}

function startRebind(key: keyof VideoControlsConfig["keyBindings"]) {
	activeRebindKey = key;
}

function resetKey(key: keyof VideoControlsConfig["keyBindings"]) {
	if (!settings) return;
	settings.videoControls.keyBindings[key] =
		DEFAULT_VIDEO_CONTROLS.keyBindings[key];
	triggerSave();
}

function formatKey(key: string): string {
	if (key === " ") return "Space";
	if (key.length === 1) return key.toUpperCase();
	return key;
}
</script>

<!-- biome-ignore lint/a11y/noStaticElementInteractions: svelte:window is a special tag for window events -->
<svelte:window onkeydown={handleKeydown} />



{#if settings}
	<div class="container">
		<header class="header">
			<div class="logo-area">
				<span class="logo-icon">⏭</span>
				<div>
					<h1>Skip Intro</h1>
					<p class="subtitle">
						Customize video controls, speeds, and keyboard shortcuts
					</p>
				</div>
			</div>

			<button
				type="button"
				class="theme-toggle"
				onclick={toggleTheme}
				aria-label="Toggle theme"
			>
				{#if theme === "frappe"}
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
						<title>Dark theme</title>
						<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
					</svg>
				{:else}
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
						<title>Light theme</title>
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2" />
						<path d="M12 20v2" />
						<path d="m4.93 4.93 1.41 1.41" />
						<path d="m17.66 17.66 1.41 1.41" />
						<path d="M2 12h2" />
						<path d="M20 12h2" />
						<path d="m6.34 17.66-1.41 1.41" />
						<path d="m19.07 4.93-1.41 1.41" />
					</svg>
				{/if}
			</button>
		</header>

		<main class="main-content">
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
					<label class="switch" for="enabled-toggle">
						<span class="sr-only">Enable Overlay</span>
						<input
							id="enabled-toggle"
							type="checkbox"
							bind:checked={settings.videoControls.enabled}
							onchange={triggerSave}
						>
						<span class="slider"></span>
					</label>
				</div>

				<div
					class="setting-row"
					class:disabled={!settings.videoControls.enabled}
				>
					<div class="setting-info">
						<span class="setting-label">Seek Duration</span>
						<span class="setting-desc"
							>Seconds to seek forward or backward</span
						>
					</div>
					<div class="number-input-wrapper">
						<input
							type="number"
							bind:value={settings.videoControls.seekSeconds}
							disabled={!settings.videoControls.enabled}
							min="1"
							max="60"
							step="1"
							onchange={triggerSave}
						>
						<span class="unit">s</span>
					</div>
				</div>

				<div
					class="setting-row"
					class:disabled={!settings.videoControls.enabled}
				>
					<div class="setting-info">
						<span class="setting-label">Playback Speed Step</span>
						<span class="setting-desc"
							>Playback-rate increment or decrement per button click</span
						>
					</div>
					<div class="number-input-wrapper">
						<input
							type="number"
							bind:value={settings.videoControls.speedStep}
							disabled={!settings.videoControls.enabled}
							min="0.05"
							max="2.0"
							step="0.05"
							onchange={triggerSave}
						>
						<span class="unit">×</span>
					</div>
				</div>

				<div
					class="setting-row"
					class:disabled={!settings.videoControls.enabled}
				>
					<div class="setting-info">
						<span class="setting-label">Start Hidden</span>
						<span class="setting-desc"
							>Hide the overlay by default until mouse activity is detected near
							the video</span
						>
					</div>
					<label class="switch" for="start-hidden-toggle">
						<span class="sr-only">Start Hidden</span>
						<input
							id="start-hidden-toggle"
							type="checkbox"
							bind:checked={settings.videoControls.startHidden}
							disabled={!settings.videoControls.enabled}
							onchange={triggerSave}
						>
						<span class="slider"></span>
					</label>
				</div>
			</section>

			<section class="section" class:disabled={!settings.videoControls.enabled}>
				<h2>Keyboard Shortcuts</h2>

				<div class="shortcut-row">
					<span class="shortcut-label">Seek Backward</span>
					<div class="shortcut-actions">
						<button
							type="button"
							class="kbd-btn"
							class:active={activeRebindKey === "seekBack"}
							disabled={!settings.videoControls.enabled}
							onclick={() => startRebind("seekBack")}
						>
							{activeRebindKey === "seekBack" ? "Press key..." : formatKey(settings.videoControls.keyBindings.seekBack)}
						</button>
						<button
							type="button"
							class="reset-btn"
							disabled={!settings.videoControls.enabled || settings.videoControls.keyBindings.seekBack === DEFAULT_VIDEO_CONTROLS.keyBindings.seekBack}
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
							disabled={!settings.videoControls.enabled}
							onclick={() => startRebind("seekFwd")}
						>
							{activeRebindKey === "seekFwd" ? "Press key..." : formatKey(settings.videoControls.keyBindings.seekFwd)}
						</button>
						<button
							type="button"
							class="reset-btn"
							disabled={!settings.videoControls.enabled || settings.videoControls.keyBindings.seekFwd === DEFAULT_VIDEO_CONTROLS.keyBindings.seekFwd}
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
							disabled={!settings.videoControls.enabled}
							onclick={() => startRebind("speedDown")}
						>
							{activeRebindKey === "speedDown" ? "Press key..." : formatKey(settings.videoControls.keyBindings.speedDown)}
						</button>
						<button
							type="button"
							class="reset-btn"
							disabled={!settings.videoControls.enabled || settings.videoControls.keyBindings.speedDown === DEFAULT_VIDEO_CONTROLS.keyBindings.speedDown}
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
							disabled={!settings.videoControls.enabled}
							onclick={() => startRebind("speedUp")}
						>
							{activeRebindKey === "speedUp" ? "Press key..." : formatKey(settings.videoControls.keyBindings.speedUp)}
						</button>
						<button
							type="button"
							class="reset-btn"
							disabled={!settings.videoControls.enabled || settings.videoControls.keyBindings.speedUp === DEFAULT_VIDEO_CONTROLS.keyBindings.speedUp}
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
			</section>
		</main>
	</div>

	{#if saveStatus !== "idle"}
		<div class="toast" class:saved={saveStatus === "saved"}>
			{#if saveStatus === "saving"}
				<span class="spinner"></span>
				Saving...
			{:else}
				Saved ✓
			{/if}
		</div>
	{/if}
{:else}
	<div class="loading-container">
		<span class="spinner large"></span>
		<p>Loading settings...</p>
	</div>
{/if}

<style>


:global(html) {
	background-color: var(--base);
	color: var(--text);
	font-family:
		-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
		sans-serif;
	transition:
		background-color 0.2s,
		color 0.2s;
	display: flex;
	justify-content: center;
	padding: 40px 20px;
	box-sizing: border-box;
	min-height: 100%;
}

:global(body) {
	margin: 0;
	padding: 0;
	width: 100%;
}

.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 200px;
	color: var(--subtext0);
}

.spinner {
	width: 16px;
	height: 16px;
	border: 2px solid var(--surface2);
	border-top-color: var(--mauve);
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
	display: inline-block;
}

.spinner.large {
	width: 32px;
	height: 32px;
	border-width: 3px;
	margin-bottom: 16px;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.container {
	width: 100%;
	max-width: 560px;
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom: 16px;
	border-bottom: 1px solid var(--surface0);
}

.logo-area {
	display: flex;
	align-items: center;
	gap: 16px;
}

.logo-icon {
	font-size: 36px;
	line-height: 1;
}

.header h1 {
	font-size: 24px;
	font-weight: 700;
	margin: 0;
	color: var(--text);
}

.subtitle {
	font-size: 13px;
	color: var(--subtext0);
	margin: 4px 0 0 0;
}

.theme-toggle {
	background: var(--surface0);
	border: 1px solid var(--surface1);
	color: var(--text);
	width: 40px;
	height: 40px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition:
		background-color 0.2s,
		border-color 0.2s;
}

.theme-toggle:hover {
	background: var(--surface1);
	border-color: var(--surface2);
}

.theme-toggle .icon {
	width: 20px;
	height: 20px;
}

.main-content {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

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

/* Switch styling */
.switch {
	position: relative;
	display: inline-block;
	width: 46px;
	height: 26px;
	flex-shrink: 0;
}

.switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: var(--surface0);
	transition: 0.2s;
	border-radius: 34px;
	border: 1px solid var(--surface1);
}

.slider:before {
	position: absolute;
	content: "";
	height: 18px;
	width: 18px;
	left: 3px;
	bottom: 3px;
	background-color: var(--text);
	transition: 0.2s;
	border-radius: 50%;
}

input:checked + .slider {
	background-color: var(--mauve);
	border-color: var(--mauve);
}

input:checked + .slider:before {
	transform: translateX(20px);
	background-color: var(--base);
}

/* Number Input Styling */
.number-input-wrapper {
	display: flex;
	align-items: center;
	background: var(--surface0);
	border: 1px solid var(--surface1);
	border-radius: 8px;
	padding: 0 10px;
	height: 38px;
	width: 90px;
	box-sizing: border-box;
	transition:
		border-color 0.2s,
		box-shadow 0.2s;
}

.number-input-wrapper:focus-within {
	border-color: var(--mauve);
	box-shadow: 0 0 0 2px rgba(202, 158, 230, 0.2);
}

.number-input-wrapper input {
	background: transparent;
	border: none;
	color: var(--text);
	font-family: inherit;
	font-size: 14px;
	font-weight: 600;
	width: 100%;
	padding: 0;
	text-align: right;
	outline: none;
	-moz-appearance: textfield;
	appearance: textfield;
}

.number-input-wrapper input::-webkit-outer-spin-button,
.number-input-wrapper input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	appearance: none;
	margin: 0;
}

.unit {
	font-size: 13px;
	color: var(--subtext0);
	margin-left: 6px;
	font-weight: 600;
}

/* Shortcuts styling */
.shortcut-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 0;
	border-bottom: 1px solid var(--surface0);
}

.shortcut-row:last-of-type {
	border-bottom: none;
}

.shortcut-label {
	font-size: 14px;
	font-weight: 500;
	color: var(--text);
}

.shortcut-actions {
	display: flex;
	align-items: center;
	gap: 12px;
}

.kbd-btn {
	background: var(--surface0);
	border: 1px solid var(--surface1);
	color: var(--blue);
	font-family: inherit;
	font-size: 13px;
	font-weight: 700;
	padding: 6px 16px;
	border-radius: 8px;
	cursor: pointer;
	min-width: 80px;
	text-align: center;
	transition: all 0.2s ease;
	border-bottom-width: 3px;
}

.kbd-btn:hover:not(:disabled) {
	background: var(--surface1);
	border-color: var(--surface2);
	color: var(--text);
}

.kbd-btn.active {
	background: rgba(202, 158, 230, 0.1);
	border-color: var(--mauve);
	color: var(--mauve);
	animation: pulse 1.5s infinite;
}

.reset-btn {
	background: transparent;
	border: 1px solid transparent;
	color: var(--subtext0);
	width: 32px;
	height: 32px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s;
}

.reset-btn:hover:not(:disabled) {
	background: var(--surface0);
	border-color: var(--surface1);
	color: var(--red);
}

.reset-btn:disabled {
	opacity: 0.3;
	cursor: not-allowed;
}

.reset-btn .icon {
	width: 16px;
	height: 16px;
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

/* Toast Notification */
.toast {
	position: fixed;
	top: 20px;
	right: 20px;
	background: var(--surface0);
	border: 1px solid var(--surface1);
	color: var(--text);
	padding: 12px 20px;
	border-radius: 12px;
	font-size: 14px;
	font-weight: 600;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
	display: flex;
	align-items: center;
	gap: 10px;
	z-index: 9999;
	animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast.saved {
	border-color: var(--green);
	color: var(--green);
	background: rgba(166, 209, 137, 0.08);
}

@keyframes slideIn {
	from {
		transform: translateY(-20px);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}

/* Global states for disabling interaction */
.disabled {
	opacity: 0.45;
	pointer-events: none;
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	border: 0;
}
</style>
