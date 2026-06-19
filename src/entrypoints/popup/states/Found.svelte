<script lang="ts">
import {
	getPlatformBehaviors,
	type PlatformConfig,
} from "~/common/platforms";
import BehaviorCard from "../components/BehaviorCard.svelte";

interface Props {
	config: PlatformConfig;
}

let { config }: Props = $props();
</script>

<section class="found">
	<dl class="platform">
		<dt class="platform-label">Platform</dt>
		<dd class="platform-value">{config.label}</dd>
	</dl>

	{#each getPlatformBehaviors(config) as behavior (behavior.type)}
		<BehaviorCard {behavior} />
	{/each}
</section>

<style>
.found {
	padding: var(--size-2) 0;
}

.platform {
	display: flex;
	justify-content: space-between;
	padding: var(--size-2) var(--size-4);
	margin: 0 0 var(--size-1);
}

.platform-label {
	color: var(--subtext0);
}

.platform-value {
	margin: 0;
}
</style>
