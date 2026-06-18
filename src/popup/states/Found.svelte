<script lang="ts">
import { getPlatformBehaviors, type PlatformConfig } from "../../common/platforms";
import BehaviorCard from "../components/BehaviorCard.svelte";

let { config }: { config: PlatformConfig } = $props();
</script>

<div class="body">
	<div class="row platform-row">
		<span class="label">Platform</span>
		<span class="value">{config.label}</span>
	</div>

	{#each getPlatformBehaviors(config) as behavior (behavior.type)}
		<BehaviorCard {behavior} />
	{/each}
</div>

<style>
.body {
	padding: var(--size-2) 0;
}

.row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: var(--size-2) var(--size-4);
}

.platform-row {
	margin-bottom: var(--size-1);
}

.label {
	font-size: var(--font-size-00);
	font-weight: 600;
	color: var(--subtext0);
	text-transform: uppercase;
	letter-spacing: 0.08em;
}

.value {
	font-size: var(--font-size-0);
	font-weight: 600;
	color: var(--text);
}
</style>
