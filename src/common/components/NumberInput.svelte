<script lang="ts">
interface Props {
	value?: number;
	disabled?: boolean;
	min?: number;
	max?: number;
	step?: number;
	unit?: string;
	onchange?: () => void;
}

let {
	value = $bindable(0),
	disabled = false,
	min,
	max,
	step = 1,
	unit,
	onchange,
}: Props = $props();
</script>

<div class="number-input-wrapper">
	<input type="number" class="input-field" bind:value {disabled} {min} {max} {step} {onchange}>
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
	padding-inline: var(--size-2);
	height: var(--size-8);
	width: var(--size-11);
}

.number-input-wrapper:focus-within {
	border-color: var(--mauve);
}

.input-field {
	background: transparent;
	border: none;
	width: 100%;
	padding: 0;
	text-align: right;
	outline: none;
	-moz-appearance: textfield;
	appearance: textfield;
}

.input-field::-webkit-outer-spin-button,
.input-field::-webkit-inner-spin-button {
	-webkit-appearance: none;
	appearance: none;
	margin: 0;
}

.unit {
	font-size: var(--font-size-0);
	color: var(--subtext0);
	margin-inline-start: var(--size-1);
}
</style>
