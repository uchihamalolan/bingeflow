<script lang="ts">
interface Props {
	active: boolean;
	disabled?: boolean;
	value: string;
	onclick: () => void;
}

let { active, disabled = false, value, onclick }: Props = $props();
</script>

<button type="button" class="kbd-btn" class:active {disabled} {onclick}>
	{#if active}
		Press key...
	{:else}
		<kbd class="key-display">{value}</kbd>
	{/if}
</button>

<style>
.kbd-btn {
	background: var(--surface0);
	border: var(--border-size-1) solid var(--surface1);
	color: var(--mauve);
	font-size: var(--font-size-1);
	border-radius: var(--radius-2);
	cursor: pointer;
	min-width: 80px;
	border-bottom-width: var(--border-size-2);

	&:hover:not(:disabled) {
		background: var(--surface1);
		border-color: var(--surface2);
		color: var(--text);
	}

	&.active {
		background: rgba(202, 158, 230, 0.1);
		border-color: var(--mauve);
		color: var(--mauve);
		animation: pulse 1.5s infinite;
	}
}

.key-display {
	background: transparent;
	border: none;
	padding: 0;
}

@keyframes pulse {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0.6;
	}
	100% {
		opacity: 1;
	}
}
</style>
