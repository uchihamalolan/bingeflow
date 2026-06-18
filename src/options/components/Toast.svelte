<script lang="ts">
import Spinner from "../../common/components/Spinner.svelte";

let {
	saveStatus,
}: {
	saveStatus: "idle" | "saving" | "saved";
} = $props();
</script>

{#if saveStatus !== "idle"}
	<div class="toast" class:saved={saveStatus === "saved"}>
		{#if saveStatus === "saving"}
			<Spinner size="small" />
			Saving...
		{:else}
			Saved ✓
		{/if}
	</div>
{/if}

<style>
.toast {
	position: fixed;
	top: 20px;
	right: 20px;
	background: var(--surface0);
	border: 1px solid var(--surface1);
	color: var(--text);
	padding: 12px 20px;
	border-radius: 12px;
	font-size: 14px;
	font-weight: 600;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
	display: flex;
	align-items: center;
	gap: 10px;
	z-index: 9999;
	animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast.saved {
	border-color: var(--green);
	color: var(--green);
	background: rgba(166, 209, 137, 0.08);
}

@keyframes slideIn {
	from {
		transform: translateY(-20px);
		opacity: 0;
	}
	to {
		transform: translateY(0);
		opacity: 1;
	}
}
</style>
