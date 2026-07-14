<script lang="ts">
import { onMount } from "svelte";
import { getCurrentTab } from "@/common/browser";
import { detectConfig, type PlatformConfig } from "@/common/platforms";
import { theme } from "@/common/store/theme.svelte";

import SettingsButton from "./components/SettingsButton.svelte";
import Found from "./components/views/Found.svelte";
import Loading from "./components/views/Loading.svelte";
import Unsupported from "./components/views/Unsupported.svelte";

type State =
	| { kind: "loading" }
	| { kind: "unsupported"; hostname?: string }
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

	const url = tab.url;
	const hostname = url?.startsWith("https://") ? new URL(url).hostname : "";
	const config = detectConfig(hostname);
	state = config ? { kind: "found", config } : { kind: "unsupported", hostname };
});
</script>

<div class="popup">
	<header class="toolbar">
		<p class="logo">
			<span class="logo-icon" aria-hidden="true">⏭</span>
			<strong class="logo-name">BingeFlow</strong>
		</p>
		<SettingsButton />
	</header>

	{#if state.kind === "loading"}
		<Loading />
	{:else if state.kind === "unsupported"}
		<Unsupported hostname={state.hostname} />
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
