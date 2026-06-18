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
	background: #0f0f13;
	width: 280px;
}

.popup {
	background: #0f0f13;
	color: #e8e8f0;
	width: 280px;
	overflow: hidden;
	border-radius: 12px;
}

header {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 16px 18px 14px;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.icon {
	font-size: 18px;
	line-height: 1;
}

.title {
	font-size: 15px;
	font-weight: 600;
	letter-spacing: 0.01em;
	color: #f0f0fa;
}
</style>
