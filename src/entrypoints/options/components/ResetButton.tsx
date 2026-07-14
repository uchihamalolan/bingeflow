const styles = {
  resetBtn:
    "bg-transparent border border-transparent text-subtext0 w-8 h-8 rounded-md flex items-center justify-center cursor-pointer hover:enabled:(bg-surface0 border-surface1 text-red) disabled:(opacity-30 cursor-not-allowed)",
  resetIcon: "w-5 h-5",
};

interface Props {
  disabled?: boolean;
  onclick: () => void;
  title?: string;
}

export default function ResetButton(props: Props) {
  return (
    <button
      type="button"
      class={styles.resetBtn}
      disabled={props.disabled ?? false}
      onClick={() => props.onclick()}
      title={props.title ?? "Reset to default"}
    >
      <span class={`${styles.resetIcon} i-lucide:rotate-ccw`} aria-hidden="true" />
    </button>
  );
}
