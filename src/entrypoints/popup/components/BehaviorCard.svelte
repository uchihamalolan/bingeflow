<script lang="ts">
import type { BehaviorConfig } from "@/common/behaviors";

interface Props {
	behavior: BehaviorConfig;
}

let { behavior }: Props = $props();
</script>

<article class="card">
	<h3 class="title">{behavior.label}</h3>
	<mark
		class:badge-on={behavior.enabled}
		class:badge-off={!behavior.enabled}
		class="badge"
	>
		{behavior.enabled ? "Active" : "Inactive"}
	</mark>
	<dl class="shortcut">
		<dt class="shortcut-label">Shortcut Key</dt>
		<dd class="shortcut-value">
			<kbd>{behavior.shortcutKey.toUpperCase()}</kbd>
		</dd>
	</dl>
</article>

<style>
.card {
	display: grid;
	grid-template-columns: auto auto 1fr;
	align-items: center;
	column-gap: var(--size-2);
	row-gap: var(--size-2);
	background: var(--surface0);
	border: var(--border-size-1) solid var(--surface1);
	border-radius: var(--radius-2);
	margin: var(--size-2) var(--size-3);
	padding: var(--size-3);
}

.title {
	margin: 0;
	font-size: inherit;
}

.badge {
	font-size: small;
	padding: var(--size-1) var(--size-2);
	border-radius: var(--radius-round);
}

.badge-on {
	background: rgba(166, 209, 137, 0.12);
	color: var(--green);
	border: var(--border-size-1) solid rgba(166, 209, 137, 0.2);
}

.badge-off {
	background: rgba(231, 130, 132, 0.12);
	color: var(--red);
	border: var(--border-size-1) solid rgba(231, 130, 132, 0.2);
}

.shortcut {
	grid-column: 1 / -1;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0;
}

.shortcut-label {
	color: var(--subtext0);
}

.shortcut-value {
	margin: 0;
}

kbd {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: var(--size-6);
	height: var(--size-6);
	padding: 0 var(--size-1);
	color: var(--mauve);
	background: rgba(202, 158, 230, 0.1);
	border: var(--border-size-1) solid rgba(202, 158, 230, 0.25);
	border-bottom-width: var(--border-size-2);
	border-radius: var(--radius-1);
}
</style>
