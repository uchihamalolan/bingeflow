<script lang="ts">
let { size = "medium" }: { size?: "small" | "medium" | "large" } = $props();
</script>

<span class="spinner" class:small={size === "small"} class:medium={size === "medium"} class:large={size === "large"}></span>

<style>
.spinner {
	border: 2px solid var(--surface2);
	border-top-color: var(--mauve);
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
	display: inline-block;
	box-sizing: border-box;
}

.spinner.small {
	width: 16px;
	height: 16px;
	border-width: 2px;
}

.spinner.medium {
	width: 20px;
	height: 20px;
	border-width: 2px;
}

.spinner.large {
	width: 32px;
	height: 32px;
	border-width: 3px;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
