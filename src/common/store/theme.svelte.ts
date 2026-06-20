import { getStoredTheme, setStoredTheme } from "@/common/browser";

type Theme = "frappe" | "latte";

function createThemeStore() {
	let current = $state<Theme>("frappe");

	return {
		get current() {
			return current;
		},
		async init() {
			const stored = await getStoredTheme();
			current = stored === "latte" ? "latte" : "frappe";
			document.documentElement.setAttribute("data-theme", current);
		},
		toggle() {
			current = current === "frappe" ? "latte" : "frappe";
			document.documentElement.setAttribute("data-theme", current);
			setStoredTheme(current);
		},
	};
}

export const theme = createThemeStore();
