<script lang="ts">
interface Props {
	theme: "frappe" | "latte";
	ontoggle: () => void;
}

let {
	theme,
	ontoggle,
}: Props = $props();
</script>

<header class="header">
	<div class="logo-area">
		<span class="logo-icon">⏭</span>
		<div>
			<h1>Skip Intro</h1>
			<p class="subtitle">
				Customize video controls, speeds, and keyboard shortcuts
			</p>
		</div>
	</div>

	<button
		type="button"
		class="theme-toggle"
		onclick={ontoggle}
		aria-label="Toggle theme"
	>
		{#if theme === "frappe"}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="icon"
			>
				<title>Dark theme</title>
				<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
			</svg>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="icon"
			>
				<title>Light theme</title>
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
</header>

<style>
.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom: var(--size-4);
	border-bottom: var(--border-size-1) solid var(--surface0);

	h1 {
		font-size: var(--font-size-4);
		font-weight: var(--font-weight-7);
		margin: 0;
	}
}

.logo-area {
	display: flex;
	align-items: center;
	gap: var(--size-4);
}

.logo-icon {
	font-size: var(--font-size-5);
	line-height: 1;
}

.subtitle {
	font-size: var(--font-size-0);
	color: var(--subtext0);
	margin: var(--size-1) 0 0 0;
}

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
	cursor: pointer;
	transition:
		background-color var(--duration-2) var(--ease-2),
		border-color var(--duration-2) var(--ease-2);

	&:hover {
		background: var(--surface1);
		border-color: var(--surface2);
	}

	.icon {
		width: 20px;
		height: 20px;
	}
}
</style>
