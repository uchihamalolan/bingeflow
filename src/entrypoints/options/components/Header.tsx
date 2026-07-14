import ThemeToggle from "./ThemeToggle";

const styles = {
  header: "flex items-center justify-between pb-4 border-b border-surface0",
  logoArea: "flex items-center gap-4",
  logoIcon: "text-[1.75rem] leading-none",
  logoTitle: "text-[1.5rem] m-0",
  subtitle: "text-subtext0 mt-1 mb-0 mx-0",
};

const rateUrl = import.meta.env.FIREFOX
  ? "https://addons.mozilla.org/firefox/addon/bingeflow/"
  : "https://chromewebstore.google.com/detail/bingeflow-placeholder";

export default function Header() {
  return (
    <header class={styles.header}>
      <div class={styles.logoArea}>
        <span class={styles.logoIcon} aria-hidden="true">
          ⏭
        </span>
        <div>
          <h1 class={styles.logoTitle}>BingeFlow</h1>
          <p class={styles.subtitle}>
            Customize video controls, speeds, and keyboard shortcuts |{" "}
            <a href="https://codeberg.org/ma101an/bingeflow" target="_blank" rel="noreferrer">
              Homepage
            </a>{" "}
            |{" "}
            <a href={rateUrl} target="_blank" rel="noreferrer">
              Rate BingeFlow
            </a>
          </p>
        </div>
      </div>

      <ThemeToggle />
    </header>
  );
}
