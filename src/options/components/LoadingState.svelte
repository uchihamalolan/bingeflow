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
	min-height: 200px;
	color: var(--subtext0);
}

.loading-container p {
	margin: 16px 0 0 0;
	font-size: 14px;
	font-weight: 500;
}
</style>
