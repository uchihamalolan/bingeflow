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
</script>

<div class="popup">
	<header>
		<span class="icon">⏭</span>
		<span class="title">Skip Intro</span>
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
:global(*) {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

:global(body) {
	background: var(--base);
	color: var(--text);
	width: 280px;
	transition: background-color 0.2s, color 0.2s;
}

.popup {
	background: var(--base);
	color: var(--text);
	width: 280px;
	overflow: hidden;
	border-radius: 12px;
}

header {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 16px 18px 14px;
	background: var(--mantle);
	border-bottom: 1px solid var(--surface0);
}

.icon {
	font-size: 18px;
	line-height: 1;
}

.title {
	font-size: 15px;
	font-weight: 600;
	letter-spacing: 0.01em;
	color: var(--text);
}
</style>
