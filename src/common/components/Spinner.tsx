const styles = {
  base: "inline-block rounded-full border-solid animate-spin",
  sizes: {
    small: "w-5 h-5 border-2 border-surface2 border-t-mauve",
    medium: "w-6 h-6 border-2 border-surface2 border-t-mauve",
    large: "w-8 h-8 border-[3px] border-surface2 border-t-mauve",
  },
};

interface Props {
  size?: "small" | "medium" | "large";
}

export default function Spinner(props: Props) {
  const size = () => props.size ?? "medium";

  return <span class={`${styles.base} ${styles.sizes[size()]}`}></span>;
}
