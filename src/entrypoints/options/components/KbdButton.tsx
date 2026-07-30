import { clsx } from "clsx";

import { getMessage } from "@/common/browser";
import { cx } from "@/common/utils/cx";

const styles = {
  kbdBtn: (active: boolean) =>
    cx({
      colors: clsx(
        "text-mauve",
        active
          ? "bg-mauve/10"
          : "bg-surface0 hover:enabled:(bg-surface1 border-surface2 text-text)",
      ),
      borders: clsx("border-b-2 rounded-md", active ? "border-mauve" : "border-(~ surface1)"),
      typography: "text-sm",
      sizing: "min-w-[80px]",
      state: clsx("cursor-pointer", active && "animate-pulse"),
    }),
  keyDisplay: cx({
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
