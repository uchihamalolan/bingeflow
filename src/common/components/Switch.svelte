<script lang="ts">
let {
	checked = $bindable(false),
	disabled = false,
	id,
	ariaLabel,
	onchange,
}: {
	checked?: boolean;
	disabled?: boolean;
	id: string;
	ariaLabel: string;
	onchange?: () => void;
} = $props();
</script>

<!-- biome-ignore lint/a11y/noLabelWithoutControl: label wraps the dynamic input and contains sr-only text -->
<label class="switch" for={id}>
	<span class="sr-only">{ariaLabel}</span>
	<input
		{id}
		type="checkbox"
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
	width: 46px;
	height: 26px;
	flex-shrink: 0;
}

.switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: var(--surface0);
	transition: 0.2s;
	border-radius: 34px;
	border: 1px solid var(--surface1);
}

.slider:before {
	position: absolute;
	content: "";
	height: 18px;
	width: 18px;
	left: 3px;
	bottom: 3px;
	background-color: var(--text);
	transition: 0.2s;
	border-radius: 50%;
}

input:checked + .slider {
	background-color: var(--mauve);
	border-color: var(--mauve);
}

input:checked + .slider:before {
	transform: translateX(20px);
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
