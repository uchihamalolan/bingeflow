import { browser } from "wxt/browser";

export const getCurrentTab = async () => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (tabs.length > 0) return tabs[0];
  const activeTabs = await browser.tabs.query({ active: true });
  return activeTabs.at(0);
};

export const openOptionsPage = () => {
  try {
    void browser.runtime.openOptionsPage();
  } catch {
    // Unimplemented in fake browser / test environment
  }
};

export const getSyncStorage = async <T>(key: string): Promise<T | undefined> => {
  const res = await browser.storage.sync.get(key);
  return res[key] as T | undefined;
};

export const setSyncStorage = async <T>(key: string, value: T): Promise<void> => {
  await browser.storage.sync.set({ [key]: value });
};

export const getLocalStorage = async <T>(key: string): Promise<T | undefined> => {
  const res = await browser.storage.local.get(key);
  return res[key] as T | undefined;
};

export const setLocalStorage = async <T>(key: string, value: T): Promise<void> => {
  await browser.storage.local.set({ [key]: value });
};

export const getMessage = (key: any, substitutions?: string | string[]): string => {
  try {
    return browser.i18n?.getMessage?.(key, substitutions) ?? String(key);
  } catch {
    return String(key);
  }
};
