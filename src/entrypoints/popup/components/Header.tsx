import ThemeToggle from "@/common/components/ThemeToggle";

import SettingsButton from "./SettingsButton";

const styles = {
  toolbar: "flex items-center justify-between py-3 px-4 bg-mantle border-b border-surface0",
  logo: "flex items-center gap-2",
  logoIcon: "h-5 w-5",
  actionsContainer: "flex items-center gap-1",
  themeToggle:
    "text-subtext0 hover:(bg-surface0 text-text) flex cursor-pointer items-center justify-center rounded-sm border-none bg-transparent p-1",
};

export default function Header() {
  return (
    <header class={styles.toolbar}>
      <p class={styles.logo}>
        <img src="/icons/128.png" alt="BingeFlow Icon" class={styles.logoIcon} />
        <strong>BingeFlow</strong>
      </p>
      <div class={styles.actionsContainer}>
        <ThemeToggle class={styles.themeToggle} />
        <SettingsButton />
      </div>
    </header>
  );
}
