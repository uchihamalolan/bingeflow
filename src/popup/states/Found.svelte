<script lang="ts">
  import type { PlatformConfig } from "../../common/platforms";

  let { config }: { config: PlatformConfig } = $props();
</script>

<div class="body">
  <div class="row">
    <span class="label">Platform</span>
    <span class="value">{config.label}</span>
  </div>

  <div class="divider"></div>

  <div class="row">
    <span class="label">Skip intro</span>
    <span class="badge" class:badge-on={config.enabled} class:badge-off={!config.enabled}>
      {config.enabled ? "Enabled" : "Disabled"}
    </span>
  </div>

  <div class="divider"></div>

  <div class="row">
    <span class="label">Shortcut</span>
    <span class="shortcut-wrap">
      <kbd>{config.shortcutKey.toUpperCase()}</kbd>
    </span>
  </div>
</div>

<style>
  .body {
    padding: 6px 0;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 18px;
  }

  .label {
    font-size: 12px;
    font-weight: 500;
    color: #7c7c9a;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .value {
    font-size: 13px;
    font-weight: 500;
    color: #e8e8f0;
    text-align: right;
    max-width: 160px;
  }

  .divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.05);
    margin: 0 18px;
  }

  .badge {
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 999px;
    letter-spacing: 0.02em;
  }

  .badge-on {
    background: rgba(52, 211, 153, 0.15);
    color: #34d399;
    border: 1px solid rgba(52, 211, 153, 0.25);
  }

  .badge-off {
    background: rgba(248, 113, 113, 0.12);
    color: #f87171;
    border: 1px solid rgba(248, 113, 113, 0.2);
  }

  .shortcut-wrap {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    height: 26px;
    padding: 0 8px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    color: #c4b5fd;
    background: rgba(139, 92, 246, 0.12);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-bottom-width: 2px;
    border-radius: 6px;
  }
</style>
