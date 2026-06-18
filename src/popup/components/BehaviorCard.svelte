<script lang="ts">
import type { BehaviorConfig } from "../../common/behaviors";

let { behavior }: { behavior: BehaviorConfig } = $props();
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
	border: 1px solid var(--surface1);
	border-radius: 8px;
	margin: 8px 14px;
	padding: 12px;
	transition: all 0.2s ease;
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
	margin-bottom: 10px;
}

.behavior-title {
	font-size: 13px;
	font-weight: 600;
	color: var(--text);
}

.detail-label {
	font-size: 11px;
	font-weight: 500;
	color: var(--subtext0);
}

.badge {
	font-size: 11px;
	font-weight: 600;
	padding: 2px 8px;
	border-radius: 999px;
	letter-spacing: 0.02em;
}

.badge-on {
	background: rgba(166, 209, 137, 0.12);
	color: var(--green);
	border: 1px solid rgba(166, 209, 137, 0.2);
}

.badge-off {
	background: rgba(231, 130, 132, 0.12);
	color: var(--red);
	border: 1px solid rgba(231, 130, 132, 0.2);
}

.shortcut-wrap {
	display: flex;
	align-items: center;
}

kbd {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 24px;
	height: 22px;
	padding: 0 6px;
	font-family: inherit;
	font-size: 11px;
	font-weight: 700;
	color: var(--mauve);
	background: rgba(202, 158, 230, 0.1);
	border: 1px solid rgba(202, 158, 230, 0.25);
	border-bottom-width: 2px;
	border-radius: 4px;
}
</style>
