import { clsx } from "clsx";

import { getMessage } from "@/common/browser";
import { cx } from "@/common/utils/cx";

const styles = {
  resetBtn: cx({
    layout: "flex items-center justify-center",
    colors: "bg-transparent text-subtext0 hover:enabled:(bg-surface0 border-surface1 text-red)",
    borders: "border-(~ transparent) rounded-md",
    sizing: "w-8 h-8",
    state: "cursor-pointer disabled:(opacity-30 cursor-not-allowed)",
  }),
  resetIcon: cx({
    sizing: "w-5 h-5",
  }),
};

interface Props {
  disabled?: boolean;
  onclick: () => void;
  title?: string;
}

export default function ResetButton(props: Props) {
  const title = props.title ?? getMessage("resetToDefaultTitle")

  return (
    <button
      type="button"
      class={styles.resetBtn}
      disabled={props.disabled ?? false}
      onClick={() => props.onclick()}
      title={title}
      aria-label={title}
    >
      <span
        class={cx({ layout: clsx(styles.resetIcon, "i-lucide:rotate-ccw") })}
        aria-hidden="true"
      />
    </button>
  );
}
