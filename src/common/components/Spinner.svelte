<script lang="ts">
let { size = "medium" }: { size?: "small" | "medium" | "large" } = $props();
</script>

<span class="spinner" class:small={size === "small"} class:medium={size === "medium"} class:large={size === "large"}></span>

<style>
.spinner {
	border: var(--border-size-2) solid var(--surface2);
	border-top-color: var(--mauve);
	border-radius: var(--radius-round);
	animation: spin 0.8s linear infinite;
	display: inline-block;
	box-sizing: border-box;
}

.spinner.small {
	width: var(--size-4);
	height: var(--size-4);
	border-width: var(--border-size-2);
}

.spinner.medium {
	width: var(--size-5);
	height: var(--size-5);
	border-width: var(--border-size-2);
}

.spinner.large {
	width: var(--size-7);
	height: var(--size-7);
	border-width: var(--border-size-3);
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
