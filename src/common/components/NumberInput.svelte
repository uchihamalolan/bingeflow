<script lang="ts">
let {
	value = $bindable(0),
	disabled = false,
	min,
	max,
	step = 1,
	unit,
	onchange,
}: {
	value?: number;
	disabled?: boolean;
	min?: number;
	max?: number;
	step?: number;
	unit?: string;
	onchange?: () => void;
} = $props();
</script>

<div class="number-input-wrapper">
	<input type="number" bind:value {disabled} {min} {max} {step} {onchange}>
	{#if unit}
		<span class="unit">{unit}</span>
	{/if}
</div>

<style>
.number-input-wrapper {
	display: flex;
	align-items: center;
	background: var(--surface0);
	border: var(--border-size-1) solid var(--surface1);
	border-radius: var(--radius-2);
	padding: 0 var(--size-2);
	height: var(--size-8);
	width: var(--size-11);
	box-sizing: border-box;
	transition:
		border-color var(--duration-2) var(--ease-2),
		box-shadow var(--duration-2) var(--ease-2);
}

.number-input-wrapper:focus-within {
	border-color: var(--mauve);
	box-shadow: 0 0 0 var(--border-size-2) rgba(202, 158, 230, 0.2);
}

.number-input-wrapper input {
	background: transparent;
	border: none;
	color: var(--text);
	font-family: inherit;
	font-size: var(--font-size-1);
	font-weight: var(--font-weight-6);
	width: 100%;
	padding: 0;
	text-align: right;
	outline: none;
	-moz-appearance: textfield;
	appearance: textfield;
}

.number-input-wrapper input::-webkit-outer-spin-button,
.number-input-wrapper input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	appearance: none;
	margin: 0;
}

.unit {
	font-size: var(--font-size-0);
	color: var(--subtext0);
	margin-left: var(--size-1);
	font-weight: var(--font-weight-6);
}
</style>
