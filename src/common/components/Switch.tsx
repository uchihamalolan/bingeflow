const styles = {
  switchContainer: "relative inline-block w-16 h-7 shrink-0",
  switchInput: "peer opacity-0 w-0 h-0",
  slider:
    "absolute cursor-pointer inset-0 bg-surface0 transition-all duration-150 rounded-full border-(~ surface1) before:(absolute content-[''] h-5 w-5 left-[3px] bottom-[3px] bg-text transition-all duration-150 rounded-full) peer-checked:(bg-mauve border-mauve before:(translate-x-[calc(4rem-1.25rem-6px)] bg-base))",
  srOnly: "absolute w-px h-px p-0 -m-px overflow-hidden clip-[rect(0,0,0,0)] border-0",
};

interface Props {
  checked?: boolean;
  disabled?: boolean;
  id: string;
  ariaLabel: string;
  onchange?: (checked: boolean) => void;
}

export default function Switch(props: Props) {
  return (
    <label class={styles.switchContainer} for={props.id}>
      <span class={styles.srOnly}>{props.ariaLabel}</span>
      <input
        id={props.id}
        type="checkbox"
        class={styles.switchInput}
        checked={props.checked ?? false}
        disabled={props.disabled}
        onChange={(e) => props.onchange?.(e.currentTarget.checked)}
      />
      <span class={styles.slider}></span>
    </label>
  );
}
