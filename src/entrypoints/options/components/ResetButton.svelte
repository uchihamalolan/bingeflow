<script lang="ts">
interface Props {
	disabled?: boolean;
	onclick: () => void;
	title?: string;
}

let {
	disabled = false,
	onclick,
	title = "Reset to default",
}: Props = $props();
</script>

<button
	type="button"
	class="reset-btn"
	{disabled}
	{onclick}
	{title}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="reset-icon"
		aria-hidden="true"
	>
		<title>{title}</title>
		<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
		<path d="M3 3v5h5" />
	</svg>
</button>

<style>
.reset-btn {
	background: transparent;
	border: var(--border-size-1) solid transparent;
	color: var(--subtext0);
	width: var(--size-7);
	height: var(--size-7);
	border-radius: var(--radius-2);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	&:hover:not(:disabled) {
		background: var(--surface0);
		border-color: var(--surface1);
		color: var(--red);
	}

	&:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
}

.reset-icon {
	width: var(--size-4);
	height: var(--size-4);
}
</style>
