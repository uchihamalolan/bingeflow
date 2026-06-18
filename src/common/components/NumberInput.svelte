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
	<input
		type="number"
		bind:value={value}
		{disabled}
		{min}
		{max}
		{step}
		{onchange}
	>
	{#if unit}
		<span class="unit">{unit}</span>
	{/if}
</div>

<style>
.number-input-wrapper {
	display: flex;
	align-items: center;
	background: var(--surface0);
	border: 1px solid var(--surface1);
	border-radius: 8px;
	padding: 0 10px;
	height: 38px;
	width: 90px;
	box-sizing: border-box;
	transition:
		border-color 0.2s,
		box-shadow 0.2s;
}

.number-input-wrapper:focus-within {
	border-color: var(--mauve);
	box-shadow: 0 0 0 2px rgba(202, 158, 230, 0.2);
}

.number-input-wrapper input {
	background: transparent;
	border: none;
	color: var(--text);
	font-family: inherit;
	font-size: 14px;
	font-weight: 600;
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
	font-size: 13px;
	color: var(--subtext0);
	margin-left: 6px;
	font-weight: 600;
}
</style>
