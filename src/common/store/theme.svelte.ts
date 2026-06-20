import { getLocalStorage, setLocalStorage } from "@/common/browser";

type Theme = "frappe" | "latte";

function createThemeStore() {
	let current = $state<Theme>("frappe");
	const THEME_KEY = "skip-intro.theme";

	return {
		get current() {
			return current;
		},
		async init() {
			const stored = await getLocalStorage<Theme>(THEME_KEY);
			current = stored === "latte" ? "latte" : "frappe";
			document.documentElement.setAttribute("data-theme", current);
		},
		toggle() {
			current = current === "frappe" ? "latte" : "frappe";
			document.documentElement.setAttribute("data-theme", current);
			setLocalStorage(THEME_KEY, current);
		},
	};
}

export const theme = createThemeStore();
