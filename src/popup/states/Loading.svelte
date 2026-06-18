<script lang="ts">
import Spinner from "../../common/components/Spinner.svelte";
</script>

<div class="loading">
	<Spinner size="medium" />
</div>

<style>
.loading {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 28px;
}
</style>
