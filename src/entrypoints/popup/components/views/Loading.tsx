import Spinner from "@/common/components/Spinner";

const styles = {
  loading: "flex justify-center items-center p-8",
};

export default function Loading() {
  return (
    <div class={styles.loading} role="status" aria-label="Loading">
      <Spinner size="medium" />
    </div>
  );
}
