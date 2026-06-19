import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	srcDir: "src",
	modules: ["@wxt-dev/module-svelte"],
	manifest: {
		permissions: ["tabs", "storage"],
		icons: {
			16: "icons/icon-16.png",
			32: "icons/icon-32.png",
			48: "icons/icon-48.png",
			96: "icons/icon-96.png",
			128: "icons/icon-128.png",
		},
		browser_specific_settings: {
			gecko: {
				id: "skip-intro@malolan.net",
				strict_min_version: "109.0",
			},
		},
		action: {
			default_icon: {
				48: "logo.png",
			},
		},
	},
});
