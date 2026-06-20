import { browser } from "wxt/browser";

export const getStoredTheme = async () => {
	const storedTheme = await browser.storage.local.get("skip-intro.theme");
	return storedTheme["skip-intro.theme"] as string;
};

export const setStoredTheme = (theme: "frappe" | "latte") => {
	browser.storage.local.set({ "skip-intro.theme": theme });
};

export const getCurrentTab = async () => {
	return (await browser.tabs.query({ active: true, currentWindow: true })).at(0);
};

export const openOptionsPage = () => {
	browser.runtime.openOptionsPage();
};
