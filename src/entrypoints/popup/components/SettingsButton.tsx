import { clsx } from "clsx";

import { getMessage, openOptionsPage } from "@/common/browser";

const styles = {
  settingsBtn: "btn-icon-ghost",
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
      <span class={clsx(styles.settingsIcon, "i-lucide:settings")} aria-hidden="true" />
    </button>
  );
}
