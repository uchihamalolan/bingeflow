import { For } from "solid-js";

import { getPlatformBehaviors, type PlatformConfig } from "@/common/platforms";

import BehaviorCard from "../BehaviorCard";

const styles = {
  found: "py-2",
  platform: "flex justify-between py-2 px-4 mb-1",
  platformLabel: "text-subtext0",
  platformValue: "m-0",
};

interface Props {
  config: PlatformConfig;
}

export default function Found(props: Props) {
  return (
    <section class={styles.found}>
      <dl class={styles.platform}>
        <dt class={styles.platformLabel}>Platform</dt>
        <dd class={styles.platformValue}>{props.config.label}</dd>
      </dl>

      <For each={getPlatformBehaviors(props.config)}>
        {(behavior) => <BehaviorCard behavior={behavior} />}
      </For>
    </section>
  );
}
