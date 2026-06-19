<script lang="ts">
interface Props {
	saveStatus: "idle" | "success" | "error";
}

let {
	saveStatus,
}: Props = $props();
</script>

{#if saveStatus !== "idle"}
	<div class="toast" class:success={saveStatus === "success"} class:error={saveStatus === "error"}>
		{#if saveStatus === "success"}
			Saved ✓
		{:else}
			Failed to save ✗
		{/if}
	</div>
{/if}

<style>
.toast {
	position: fixed;
	top: var(--size-5);
	right: var(--size-5);
	background: var(--surface0);
	border: var(--border-size-1) solid var(--surface1);
	padding: var(--size-3) var(--size-5);
	border-radius: var(--radius-3);
	font-size: var(--font-size-1);
	font-weight: var(--font-weight-6);
	box-shadow: var(--shadow-3);
	display: flex;
	align-items: center;
	gap: var(--size-2);
	z-index: 9999;
	animation: slideIn var(--duration-3) var(--ease-out-3);
}

.toast.success {
	border-color: var(--green);
	color: var(--green);
	background: rgba(166, 209, 137, 0.08);
}

.toast.error {
	border-color: var(--red);
	color: var(--red);
	background: rgba(231, 130, 132, 0.08);
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
