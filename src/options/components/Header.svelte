<script lang="ts">
import ThemeToggle from "./ThemeToggle.svelte";
</script>

<header class="header">
	<div class="logo-area">
		<span class="logo-icon" aria-hidden="true">⏭</span>
		<div>
			<h1>Skip Intro</h1>
			<p class="subtitle">Customize video controls, speeds, and keyboard shortcuts</p>
		</div>
	</div>

	<ThemeToggle />
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
	color: var(--subtext0);
	margin: var(--size-1) 0 0 0;
}
</style>
