import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
	manifest_version: 3,
	name: pkg.name,
	version: pkg.version,
	icons: {
		16: "icons/icon-16.png",
		32: "icons/icon-32.png",
		48: "icons/icon-48.png",
		96: "icons/icon-96.png",
		128: "icons/icon-128.png",
	},
	action: {
		default_icon: {
			48: "logo.png",
		},
		default_popup: "src/popup/index.html",
	},
	options_page: "src/options/index.html",
	content_scripts: [
		{
			js: ["src/content/main.ts"],
			matches: ["https://*/*"],
		},
	],
	permissions: ["tabs", "storage"],
	browser_specific_settings: {
		gecko: {
			id: "skip-intro@malolan.net",
			strict_min_version: "109.0",
		},
	},
});
