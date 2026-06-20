<script lang="ts">
import ThemeToggle from "./ThemeToggle.svelte";
</script>

<header class="header">
	<div class="logo-area">
		<span class="logo-icon" aria-hidden="true">⏭</span>
		<div>
			<h1 class="logo-title">BingeFlow</h1>
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
}

.logo-title {
	font-size: var(--font-size-4);
	margin: 0;
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
	margin-block-start: var(--size-1);
	margin-block-end: 0;
	margin-inline: 0;
}
</style>
