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
  logo: cx({
    layout: "flex items-center gap-2",
  }),
  logoIcon: cx({
    sizing: "h-5 w-5",
  }),
  actionsContainer: cx({
    layout: "flex items-center gap-1",
  }),
  themeToggle: cx({
    layout: "flex items-center justify-center",
    colors: "text-subtext0 bg-transparent hover:(bg-surface0 text-text)",
    borders: "border-none rounded-sm",
    spacing: "p-1",
    state: "cursor-pointer",
  }),
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
