export const getStoredTheme = async () => {
	const storedTheme = await chrome.storage.local.get("skip-intro.theme");
	return storedTheme["skip-intro.theme"] as string;
};

export const setStoredTheme = (theme: "frappe" | "latte") => {
	chrome.storage.local.set({ "skip-intro.theme": theme });
};

export const getCurrentTab = async () => {
	return (await chrome.tabs.query({ active: true, currentWindow: true })).at(0);
};

export const openOptionsPage = () => {
	chrome.runtime.openOptionsPage();
};
