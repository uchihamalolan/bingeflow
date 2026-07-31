import { clsx } from "clsx";

import { getMessage, openOptionsPage } from "@/common/browser";
import { cx } from "@/common/utils/cx";

const styles = {
  settingsBtn: cx({
    layout: "flex items-center justify-center",
    colors: "bg-transparent text-subtext0 hover:(bg-surface0 text-text)",
    borders: "border-none rounded-sm",
    spacing: "p-1",
    state: "cursor-pointer",
  }),
  settingsIcon: cx({
    sizing: "w-5 h-5",
  }),
};

export default function SettingsButton() {
  return (
    <button
      class={styles.settingsBtn}
      type="button"
      onClick={openOptionsPage}
      aria-label={getMessage("openSettingsAria")}
    >
      <span
        class={cx({ layout: clsx(styles.settingsIcon, "i-lucide:settings") })}
        aria-hidden="true"
      />
    </button>
  );
}
