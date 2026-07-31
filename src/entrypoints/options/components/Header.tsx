import { getMessage } from "@/common/browser";
import ThemeToggle from "@/common/components/ThemeToggle";
import { cx } from "@/common/utils/cx";

const styles = {
  header: cx({
    layout: "flex items-center justify-between",
    spacing: "pb-4",
    borders: "border-b border-surface0",
  }),
  logoArea: "flex items-center gap-4",
  logoIcon: "w-9 h-9",
  logoTitle: "text-[1.5rem]",
  subtitle: "text-subtext0 mt-1",
  themeToggle: cx({
    preset: "flex-center",
    colors: "bg-surface0 hover:(bg-surface1 border-surface2)",
    borders: "border-(~ surface1) rounded-full",
    sizing: "h-12 w-12",
    state: "cursor-pointer",
  }),
};

export default function Header() {
  return (
    <header class={styles.header}>
      <div class={styles.logoArea}>
        <img src="/icons/128.png" alt="BingeFlow Icon" class={styles.logoIcon} />
        <div>
          <h1 class={styles.logoTitle}>BingeFlow</h1>
          <p class={styles.subtitle}>{getMessage("optionsSubtitle")}</p>
        </div>
      </div>

      <ThemeToggle class={styles.themeToggle} />
    </header>
  );
}
