<script lang="ts">
import Spinner from "~/common/components/Spinner.svelte";
</script>

<div class="loading" role="status" aria-label="Loading">
	<Spinner size="medium" />
</div>

<style>
.loading {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: var(--size-7);
}
</style>
