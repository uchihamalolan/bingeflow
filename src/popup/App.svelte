<script lang="ts">
import { onMount } from "svelte";
import { getCurrentTab, openOptionsPage } from "../common/chrome";
import { detectConfig, type PlatformConfig } from "../common/platforms";
import { theme } from "../common/store/theme.svelte";

import SettingsButton from "./components/SettingsButton.svelte";
import Found from "./states/Found.svelte";
import Loading from "./states/Loading.svelte";
import Unsupported from "./states/Unsupported.svelte";

type State =
	| { kind: "loading" }
	| { kind: "unsupported" }
	| { kind: "found"; config: PlatformConfig };

let state = $state<State>({ kind: "loading" });

onMount(async () => {
	await theme.init();

	// setting config
	const tab = await getCurrentTab();
	if (!tab) {
		state = { kind: "unsupported" };
		return;
	}

	const hostname = tab.url ? new URL(tab.url).hostname : "";
	const config = detectConfig(hostname);
	state = config ? { kind: "found", config } : { kind: "unsupported" };
});
</script>

<div class="popup">
	<header class="toolbar">
		<p class="logo">
			<span class="logo-icon" aria-hidden="true">⏭</span>
			<strong class="logo-name">Skip Intro</strong>
		</p>
		<SettingsButton />
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

.toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: var(--size-3) var(--size-4);
	background: var(--mantle);
	border-bottom: var(--border-size-1) solid var(--surface0);
}

.logo {
	display: flex;
	align-items: center;
	gap: var(--size-2);
	margin: 0;
}
</style>
