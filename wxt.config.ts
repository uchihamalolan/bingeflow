import OpenProps from "open-props";
import postcssJitProps from "postcss-jit-props";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	imports: false,
	srcDir: "src",
	modules: ["@wxt-dev/module-svelte"],
	vite: () => ({
		css: {
			postcss: {
				plugins: [postcssJitProps(OpenProps)],
			},
		},
	}),
	manifest: {
		name: "BingeFlow",
		description:
			"Automatically skip intros, recaps, and next-episode countdowns on streaming platforms.",
		homepage_url: "https://codeberg.org/ma101an/bingeflow",
		permissions: ["tabs", "storage"],
		icons: {
			16: "icons/icon-16.png",
			24: "icons/icon-24.png",
			32: "icons/icon-32.png",
			64: "icons/icon-64.png",
			128: "icons/icon-128.png",
			256: "icons/icon-256.png",
		},
		browser_specific_settings: {
			gecko: {
				id: "bingeflow@malolan.net",
				strict_min_version: "142.0",
				data_collection_permissions: {
					required: ["none"],
				},
			},
		},
		action: {
			default_icon: {
				48: "icons/icon-48.png",
				96: "icons/icon-96.png",
				128: "icons/icon-128.png",
			},
		},
	},
});
