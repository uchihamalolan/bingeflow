<script lang="ts">
import { theme } from "@/common/store/theme.svelte";
</script>

<button
	class="theme-toggle"
	type="button"
	onclick={theme.toggle}
	aria-label={theme.current === "frappe" ? "Switch to light theme" : "Switch to dark theme"}
>
	{#if theme.current === "frappe"}
		<svg
			class="icon"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<title>Dark theme active</title>
			<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
		</svg>
	{:else}
		<svg
			class="icon"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<title>Light theme active</title>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2" />
			<path d="M12 20v2" />
			<path d="m4.93 4.93 1.41 1.41" />
			<path d="m17.66 17.66 1.41 1.41" />
			<path d="M2 12h2" />
			<path d="M20 12h2" />
			<path d="m6.34 17.66-1.41 1.41" />
			<path d="m19.07 4.93-1.41 1.41" />
		</svg>
	{/if}
</button>

<style>
.theme-toggle {
	background: var(--surface0);
	border: var(--border-size-1) solid var(--surface1);
	color: var(--text);
	width: var(--size-8);
	height: var(--size-8);
	border-radius: var(--radius-round);
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		background: var(--surface1);
		border-color: var(--surface2);
	}
}

.icon {
	width: 20px;
	height: 20px;
}
</style>
