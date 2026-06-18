<script lang="ts">
import type { BehaviorConfig } from "../../common/behaviors";

interface Props {
	behavior: BehaviorConfig;
}

let { behavior }: Props = $props();
</script>

<div class="behavior-card">
	<div class="card-row">
		<span class="behavior-title">{behavior.label}</span>
		<span
			class="badge"
			class:badge-on={behavior.enabled}
			class:badge-off={!behavior.enabled}
		>
			{behavior.enabled ? "Active" : "Inactive"}
		</span>
	</div>
	<div class="card-row detail-row">
		<span class="detail-label">Shortcut Key</span>
		<span class="shortcut-wrap">
			<kbd>{behavior.shortcutKey.toUpperCase()}</kbd>
		</span>
	</div>
</div>

<style>
.behavior-card {
	background: var(--surface0);
	border: var(--border-size-1) solid var(--surface1);
	border-radius: var(--radius-2);
	margin: var(--size-2) var(--size-3);
	padding: var(--size-3);
	transition: all var(--duration-2) var(--ease-2);
}

.behavior-card:hover {
	background: var(--surface1);
	border-color: var(--surface2);
}

.card-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.card-row:not(:last-child) {
	margin-bottom: var(--size-2);
}

.behavior-title {
	font-size: 13px;
	font-weight: 600;
}

.detail-label {
	font-size: 11px;
	font-weight: 500;
	color: var(--subtext0);
}

.badge {
	font-size: var(--font-size-00);
	font-weight: 600;
	padding: var(--size-1) var(--size-2);
	border-radius: var(--radius-round);
	letter-spacing: 0.02em;
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

.shortcut-wrap {
	display: flex;
	align-items: center;
}

kbd {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: var(--size-6);
	height: var(--size-6);
	padding: 0 var(--size-1);
	font-family: inherit;
	font-size: var(--font-size-00);
	font-weight: 700;
	color: var(--mauve);
	background: rgba(202, 158, 230, 0.1);
	border: var(--border-size-1) solid rgba(202, 158, 230, 0.25);
	border-bottom-width: var(--border-size-2);
	border-radius: var(--radius-1);
}
</style>
