import ThemeToggle from "@/common/components/ThemeToggle";
import { cx } from "@/common/utils/cx";

import SettingsButton from "./SettingsButton";

const styles = {
  toolbar: cx({
    layout: "flex items-center justify-between",
    colors: "bg-mantle",
    borders: "border-b border-surface0",
    spacing: "py-3 px-4",
  }),
  logo: "flex items-center gap-2",
  logoIcon: "h-5 w-5",
  actionsContainer: "flex items-center gap-1",
  themeToggle: "btn-icon-ghost",
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
