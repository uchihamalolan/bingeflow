import { clsx } from "clsx";

const styles = {
  kbdBtn: (active: boolean) =>
    clsx(
      "bg-surface0 border-(~ surface1) text-mauve text-sm rounded-md cursor-pointer min-w-[80px] border-b-2 hover:enabled:(bg-surface1 border-surface2 text-text)",
      active && "bg-[rgba(202,158,230,0.1)] border-mauve text-mauve animate-pulse",
    ),
  keyDisplay: "bg-transparent border-none",
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
      {props.active ? "Press key..." : <kbd class={styles.keyDisplay}>{props.value}</kbd>}
    </button>
  );
}
