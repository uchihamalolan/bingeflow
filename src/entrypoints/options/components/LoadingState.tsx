import Spinner from "@/common/components/Spinner";

const styles = {
  loadingContainer: "flex flex-col items-center justify-center min-h-80 text-subtext0",
  loadingText: "mt-5",
};

export default function LoadingState() {
  return (
    <div class={styles.loadingContainer} role="status">
      <Spinner size="large" />
      <p class={styles.loadingText}>Loading settings...</p>
    </div>
  );
}
