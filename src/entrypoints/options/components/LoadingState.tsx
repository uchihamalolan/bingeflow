import Spinner from "@/common/components/Spinner";
import { cx } from "@/common/utils/cx";

const styles = {
  loadingContainer: cx({
    preset: "flex-center",
    layout: "flex-col",
    colors: "text-subtext0",
    sizing: "min-h-80",
  }),
  loadingText: "mt-5",
};

export default function LoadingState() {
  return (
    <output class={styles.loadingContainer}>
      <Spinner size="large" />
      <p class={styles.loadingText}>Loading settings...</p>
    </output>
  );
}
