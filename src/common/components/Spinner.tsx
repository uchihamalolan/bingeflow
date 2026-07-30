import { clsx } from "clsx";

import { cx } from "@/common/utils/cx";

const styles = {
  base: cx({
    layout: "inline-block",
    borders: "rounded-full border-solid border-surface2 border-t-mauve",
    state: "animate-spin",
  }),
  sizes: {
    small: cx({ sizing: "w-5 h-5", borders: "border-2" }),
    medium: cx({ sizing: "w-6 h-6", borders: "border-2" }),
    large: cx({ sizing: "w-8 h-8", borders: "border-[3px]" }),
  },
};

interface Props {
  size?: "small" | "medium" | "large";
}

export default function Spinner(props: Props) {
  const size = () => props.size ?? "medium";

  return <span class={cx({ layout: clsx(styles.base, styles.sizes[size()]) })}></span>;
}
