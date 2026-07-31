import Spinner from "@/common/components/Spinner";
import { cx } from "@/common/utils/cx";

const styles = {
  loadingContainer: cx({
    layout: "flex flex-col items-center justify-center",
    colors: "text-subtext0",
    sizing: "min-h-80",
  }),
  loadingText: cx({
    spacing: "mt-5",
  }),
};

export default function LoadingState() {
  return (
    <output class={styles.loadingContainer}>
      <Spinner size="large" />
      <p class={styles.loadingText}>Loading settings...</p>
    </output>
  );
}
