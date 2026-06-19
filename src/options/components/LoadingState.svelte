<script lang="ts">
import Spinner from "../../common/components/Spinner.svelte";
</script>

<div class="loading-container" role="status">
	<Spinner size="large" />
	<p class="loading-text">Loading settings...</p>
</div>

<style>
.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: var(--size-14);
	color: var(--subtext0);
}

.loading-text {
	margin-block-start: var(--size-4);
	margin-block-end: 0;
	margin-inline: 0;
}
</style>
