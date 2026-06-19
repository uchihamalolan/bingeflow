<script lang="ts">
interface Props {
	checked?: boolean;
	disabled?: boolean;
	id: string;
	ariaLabel: string;
	onchange?: () => void;
}

let {
	checked = $bindable(false),
	disabled = false,
	id,
	ariaLabel,
	onchange,
}: Props = $props();
</script>

<!-- biome-ignore lint/a11y/noLabelWithoutControl: label wraps the dynamic input and contains sr-only text -->
<label class="switch" for={id}>
	<span class="sr-only">{ariaLabel}</span>
	<input
		{id}
		type="checkbox"
		class="switch-input"
		bind:checked={checked}
		{disabled}
		{onchange}
	>
	<span class="slider"></span>
</label>

<style>
.switch {
	position: relative;
	display: inline-block;
	width: var(--size-9);
	height: var(--size-6);
	flex-shrink: 0;
}

.switch-input {
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	inset: 0;
	background-color: var(--surface0);
	transition: var(--duration-2);
	border-radius: var(--radius-round);
	border: var(--border-size-1) solid var(--surface1);
}

.slider:before {
	position: absolute;
	content: "";
	height: var(--size-4);
	width: var(--size-4);
	left: 3px;
	bottom: 3px;
	background-color: var(--text);
	transition: var(--duration-2);
	border-radius: var(--radius-round);
}

.switch-input:checked + .slider {
	background-color: var(--mauve);
	border-color: var(--mauve);
}

.switch-input:checked + .slider:before {
	transform: translateX(calc(var(--size-9) - var(--size-4) - 6px));
	background-color: var(--base);
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	border: 0;
}
</style>
