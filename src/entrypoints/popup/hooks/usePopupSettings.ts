import { createSignal, onMount } from "solid-js";

import { getCurrentTab } from "@/common/browser";
import { getTopLevelDomain, isDomainEnabled } from "@/common/domain";
import { loadSettings, saveSettings, type Settings } from "@/common/settings";
import { theme } from "@/common/store/theme";

export function usePopupSettings() {
  const [settings, setSettings] = createSignal<Settings | null>(null);
  const [currentDomain, setCurrentDomain] = createSignal<string | null>(null);

  onMount(async () => {
    await theme.init();
    const loaded = await loadSettings();
    setSettings(loaded);

    const tab = await getCurrentTab();
    if (tab?.url) {
      try {
        const url = new URL(tab.url);
        if (url.protocol === "http:" || url.protocol === "https:") {
          const domain = getTopLevelDomain(url.hostname);
          if (domain) {
            setCurrentDomain(domain);
          }
        }
      } catch {
        // Ignored for non-standard URLs
      }
    }
  });

  const isEnabled = () => {
    const s = settings();
    const domain = currentDomain();
    if (!s) return false;
    if (!domain) return s.videoControls.enabled;
    return isDomainEnabled(domain, s.enabledDomains);
  };

  const toggleEnabled = async (checked: boolean) => {
    const current = settings();
    if (!current) return;

    const domain = currentDomain();
    let updatedDomains = [...current.enabledDomains];

    if (domain) {
      const set = new Set(updatedDomains.map((d) => d.toLowerCase()));
      if (checked) {
        set.add(domain.toLowerCase());
      } else {
        set.delete(domain.toLowerCase());
      }
      updatedDomains = Array.from(set);
    }

    const updated: Settings = {
      ...current,
      videoControls: {
        ...current.videoControls,
        enabled: domain ? current.videoControls.enabled : checked,
      },
      enabledDomains: updatedDomains,
    };

    setSettings(updated);
    await saveSettings(updated);
  };

  return {
    settings,
    currentDomain,
    isEnabled,
    toggleEnabled,
  };
}
