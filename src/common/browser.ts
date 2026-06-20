import { browser } from "wxt/browser";

export const getCurrentTab = async () => {
	return (await browser.tabs.query({ active: true, currentWindow: true })).at(0);
};

export const openOptionsPage = () => {
	browser.runtime.openOptionsPage();
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
