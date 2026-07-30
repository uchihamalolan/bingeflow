import { clsx } from "clsx";

import { cx } from "@/common/utils/cx";

const styles = {
  switchContainer: {
    sm: cx({ layout: "relative inline-block shrink-0", sizing: "w-10 h-5.5" }),
    md: cx({ layout: "relative inline-block shrink-0", sizing: "w-16 h-7" }),
    lg: cx({ layout: "relative inline-block shrink-0", sizing: "w-20 h-9.5" }),
  },
  switchInput: cx({ layout: "peer sr-only" }),
  sliderBase: cx({
    layout: "absolute inset-0",
    colors: "bg-surface0 peer-checked:(bg-mauve border-mauve before:bg-base)",
    borders: "rounded-full border-(~ surface1)",
    state: "cursor-pointer transition duration-150 before:(absolute content-[''] bg-text transition duration-150 rounded-full)",
  }),
  sliderSize: {
    sm: "before:(h-4 w-4 left-[2.5px] bottom-[2.5px]) peer-checked:before:translate-x-[calc(2.5rem-1rem-5px)]",
    md: "before:(h-5 w-5 left-[3px] bottom-[3px]) peer-checked:before:translate-x-[calc(4rem-1.25rem-6px)]",
    lg: "before:(h-7 w-7 left-[4px] bottom-[4px]) peer-checked:before:translate-x-[calc(5rem-1.75rem-8px)]",
  },
  srOnly: "sr-only",
};

interface Props {
  checked?: boolean;
  disabled?: boolean;
  id: string;
  ariaLabel: string;
  onchange?: (checked: boolean) => void;
  size?: "sm" | "md" | "lg";
}

export default function Switch(props: Props) {
  const size = () => props.size ?? "md";

  return (
    <label class={styles.switchContainer[size()]} for={props.id}>
      <span class={styles.srOnly}>{props.ariaLabel}</span>
      <input
        id={props.id}
        type="checkbox"
        class={styles.switchInput}
        checked={props.checked ?? false}
        disabled={props.disabled}
        onChange={(e) => props.onchange?.(e.currentTarget.checked)}
      />
      <span class={cx({ state: clsx(styles.sliderBase, styles.sliderSize[size()]) })}></span>
    </label>
  );
}
