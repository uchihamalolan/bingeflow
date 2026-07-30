import { cx } from "@/common/utils/cx";

const styles = {
  wrapper: cx({
    layout: "flex items-center",
    colors: "bg-surface0 focus-within:border-mauve",
    borders: "border-(~ surface1) rounded-md",
    spacing: "px-2",
    sizing: "h-8 w-30",
  }),
  inputField: cx({
    colors: "bg-transparent",
    borders: "border-none outline-none",
    sizing: "w-full",
    typography: "text-right appearance-none",
  }),
  unitStyle: cx({
    typography: "text-[0.75rem] text-subtext0",
    spacing: "ml-1",
  }),
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
