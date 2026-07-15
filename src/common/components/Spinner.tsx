import { clsx } from "clsx";

const styles = {
  base: "inline-block rounded-full border-solid animate-spin border-surface2 border-t-mauve",
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
