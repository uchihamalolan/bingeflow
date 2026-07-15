import ThemeToggle from "@/common/components/ThemeToggle";

const styles = {
  header: "flex items-center justify-between pb-4 border-b border-surface0",
  logoArea: "flex items-center gap-4",
  logoIcon: "w-9 h-9",
  logoTitle: "text-[1.5rem]",
  subtitle: "text-subtext0 mt-1",
  themeToggle:
    "bg-surface0 border-(~ surface1) hover:(bg-surface1 border-surface2) flex h-12 w-12 cursor-pointer items-center justify-center rounded-full",
};

export default function Header() {
  return (
    <header class={styles.header}>
      <div class={styles.logoArea}>
        <img src="/icons/128.png" alt="BingeFlow Icon" class={styles.logoIcon} />
        <div>
          <h1 class={styles.logoTitle}>BingeFlow</h1>
          <p class={styles.subtitle}>
            Dart past intros, glide back & forward, and hover over controls.
          </p>
        </div>
      </div>

      <ThemeToggle class={styles.themeToggle} />
    </header>
  );
}
