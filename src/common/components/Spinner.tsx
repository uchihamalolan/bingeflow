import { clsx } from "clsx";

import { cx } from "@/common/utils/cx";

const styles = {
  base: cx({
    layout: "inline-block",
    borders: "rounded-full border-solid border-surface2 border-t-mauve",
    state: "animate-spin",
  }),
  sizes: {
    small: "w-5 h-5 border-2",
    medium: "w-6 h-6 border-2",
    large: "w-8 h-8 border-[3px]",
  },
};

interface Props {
  size?: "small" | "medium" | "large";
}

export default function Spinner(props: Props) {
  const size = () => props.size ?? "medium";

  return <span class={clsx(styles.base, styles.sizes[size()])}></span>;
}
