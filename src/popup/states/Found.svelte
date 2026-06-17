<script lang="ts">
import type { PlatformConfig } from "../../common/platforms";
import BehaviorCard from "../components/BehaviorCard.svelte";

let { config }: { config: PlatformConfig } = $props();
</script>

<div class="body">
  <div class="row platform-row">
    <span class="label">Platform</span>
    <span class="value">{config.label}</span>
  </div>

  {#each config.behaviors as behavior (behavior.type)}
    <BehaviorCard {behavior} />
  {/each}
</div>

<style>
.body {
  padding: 8px 0;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 18px;
}

.platform-row {
  margin-bottom: 4px;
}

.label {
  font-size: 11px;
  font-weight: 600;
  color: #7c7c9a;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.value {
  font-size: 13px;
  font-weight: 600;
  color: #e8e8f0;
}
</style>
