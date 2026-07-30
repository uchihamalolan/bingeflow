import { getMessage } from "@/common/browser";
import { cx } from "@/common/utils/cx";

const styles = {
  kbdBtn: (active: boolean) =>
    cx({
      colors: active ? "bg-[rgba(202,158,230,0.1)] text-mauve" : "bg-surface0 text-mauve hover:enabled:(bg-surface1 border-surface2 text-text)",
      borders: active ? "border-mauve border-b-2 rounded-md" : "border-(~ surface1) border-b-2 rounded-md",
      typography: "text-sm",
      sizing: "min-w-[80px]",
      state: active ? "animate-pulse cursor-pointer" : "cursor-pointer",
    }),
  keyDisplay: cx({
    colors: "bg-transparent",
    borders: "border-none",
  }),
};

interface Props {
  active: boolean;
  disabled?: boolean;
  value: string;
  onclick: () => void;
}

export default function KbdButton(props: Props) {
  return (
    <button
      type="button"
      class={styles.kbdBtn(props.active)}
      disabled={props.disabled ?? false}
      onClick={() => props.onclick()}
    >
      {props.active ? (
        getMessage("pressKeyPlaceholder")
      ) : (
        <kbd class={styles.keyDisplay}>{props.value}</kbd>
      )}
    </button>
  );
}
