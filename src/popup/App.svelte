<script lang="ts">
import { onMount } from "svelte";
import { detectConfig, type PlatformConfig } from "../common/platforms";

import Found from "./states/Found.svelte";
import Loading from "./states/Loading.svelte";
import Unsupported from "./states/Unsupported.svelte";

type State =
	| { kind: "loading" }
	| { kind: "unsupported" }
	| { kind: "found"; config: PlatformConfig };

let state = $state<State>({ kind: "loading" });

onMount(async () => {
	const storedTheme = await chrome.storage.local.get("skip-intro.theme");
	const theme = storedTheme["skip-intro.theme"] === "latte" ? "latte" : "frappe";
	document.documentElement.setAttribute("data-theme", theme);

	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	const hostname = tab.url ? new URL(tab.url).hostname : "";
	const config = detectConfig(hostname);
	state = config ? { kind: "found", config } : { kind: "unsupported" };
});

function openOptions() {
	chrome.runtime.openOptionsPage();
}
</script>

<div class="popup">
	<header>
		<div class="logo-area">
			<span class="icon">⏭</span>
			<span class="title">Skip Intro</span>
		</div>
		<button
			type="button"
			class="settings-btn"
			onclick={openOptions}
			aria-label="Open Settings"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="settings-icon"
			>
				<title>Settings</title>
				<circle cx="12" cy="12" r="3" />
				<path
					d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
				/>
			</svg>
		</button>
	</header>

	{#if state.kind === "loading"}
		<Loading />
	{:else if state.kind === "unsupported"}
		<Unsupported />
	{:else}
		<Found config={state.config} />
	{/if}
</div>

<style>
.popup {
	overflow: hidden;
	border-radius: var(--radius-3);
}

header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: var(--size-3) var(--size-4);
	background: var(--mantle);
	border-bottom: var(--border-size-1) solid var(--surface0);
}

.logo-area {
	display: flex;
	align-items: center;
	gap: var(--size-2);
}

.icon {
	font-size: var(--font-size-2);
	line-height: 1;
}

.title {
	font-size: var(--font-size-1);
	font-weight: var(--font-weight-6);
	letter-spacing: 0.01em;
}

.settings-btn {
	background: transparent;
	border: none;
	color: var(--subtext0);
	cursor: pointer;
	padding: var(--size-1);
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: var(--radius-1);
	transition:
		background-color var(--duration-2) var(--ease-2),
		color var(--duration-2) var(--ease-2);
}

.settings-btn:hover {
	background: var(--surface0);
	color: var(--text);
}

.settings-icon {
	width: var(--size-4);
	height: var(--size-4);
}
</style>
