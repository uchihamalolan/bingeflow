import { getMessage, openOptionsPage } from "@/common/browser";

const styles = {
  settingsBtn:
    "bg-transparent border-none text-subtext0 p-1 rounded-sm cursor-pointer flex items-center justify-center hover:(bg-surface0 text-text)",
  settingsIcon: "w-5 h-5",
};

export default function SettingsButton() {
  return (
    <button
      class={styles.settingsBtn}
      type="button"
      onClick={openOptionsPage}
      aria-label={getMessage("openSettingsAria")}
    >
      <span class={`${styles.settingsIcon} i-lucide:settings`} aria-hidden="true" />
    </button>
  );
}
