<script lang="ts">
import Spinner from "../../common/components/Spinner.svelte";
</script>

<div class="loading-container">
	<Spinner size="large" />
	<p>Loading settings...</p>
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

.loading-container p {
	margin: var(--size-4) 0 0 0;
	font-size: var(--font-size-1);
	font-weight: var(--font-weight-5);
}
</style>
