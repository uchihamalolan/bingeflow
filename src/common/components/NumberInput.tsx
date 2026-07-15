const styles = {
  wrapper:
    "flex items-center bg-surface0 border-(~ surface1) rounded-md px-2 h-8 w-30 focus-within:border-mauve",
  inputField: "bg-transparent border-none w-full text-right outline-none appearance-none",
  unitStyle: "text-[0.75rem] text-subtext0 ml-1",
};

interface Props {
  value?: number;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onchange?: (value: number) => void;
}

export default function NumberInput(props: Props) {
  return (
    <div class={styles.wrapper}>
      <input
        type="number"
        class={styles.inputField}
        value={props.value ?? 0}
        disabled={props.disabled}
        min={props.min}
        max={props.max}
        step={props.step ?? 1}
        onInput={(e) => props.onchange?.(Number(e.currentTarget.value))}
      />
      {props.unit && <span class={styles.unitStyle}>{props.unit}</span>}
    </div>
  );
}
