<script lang="ts">
import type { BehaviorConfig } from "../../common/platforms";

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
	background: rgba(255, 255, 255, 0.02);
	border: 1px solid rgba(255, 255, 255, 0.05);
	border-radius: 8px;
	margin: 8px 14px;
	padding: 12px;
	transition: all 0.2s ease;
}

.behavior-card:hover {
	background: rgba(255, 255, 255, 0.04);
	border-color: rgba(255, 255, 255, 0.08);
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
	color: #e8e8f0;
}

.detail-label {
	font-size: 11px;
	font-weight: 500;
	color: #7c7c9a;
}

.badge {
	font-size: 11px;
	font-weight: 600;
	padding: 2px 8px;
	border-radius: 999px;
	letter-spacing: 0.02em;
}

.badge-on {
	background: rgba(52, 211, 153, 0.12);
	color: #34d399;
	border: 1px solid rgba(52, 211, 153, 0.2);
}

.badge-off {
	background: rgba(248, 113, 113, 0.1);
	color: #f87171;
	border: 1px solid rgba(248, 113, 113, 0.15);
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
	color: #c4b5fd;
	background: rgba(139, 92, 246, 0.1);
	border: 1px solid rgba(139, 92, 246, 0.25);
	border-bottom-width: 2px;
	border-radius: 4px;
}
</style>
