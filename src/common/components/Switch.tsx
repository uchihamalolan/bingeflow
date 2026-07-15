import { clsx } from "clsx";

const styles = {
  switchContainer: {
    sm: "relative inline-block w-10 h-5.5 shrink-0",
    md: "relative inline-block w-16 h-7 shrink-0",
    lg: "relative inline-block w-20 h-9.5 shrink-0",
  },
  switchInput: "peer sr-only",
  sliderBase:
    "absolute cursor-pointer inset-0 bg-surface0 transition duration-150 rounded-full border-(~ surface1) before:(absolute content-[''] bg-text transition duration-150 rounded-full) peer-checked:(bg-mauve border-mauve before:bg-base)",
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
      <span class={clsx(styles.sliderBase, styles.sliderSize[size()])}></span>
    </label>
  );
}
