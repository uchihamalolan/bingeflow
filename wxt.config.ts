import UnoCSS from "unocss/vite";
import solidPlugin from "vite-plugin-solid";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  imports: false,
  srcDir: "src",
  vite: () => ({
    plugins: [UnoCSS(), solidPlugin()],
  }),
  manifest: {
    name: "BingeFlow",
    version: "0.0.3",
    description: "Automatically skip intros, recaps & control video.",
    homepage_url: "https://github.com/uchihamalolan/bingeflow",
    permissions: ["tabs", "storage"],
    action: {
      default_icon: "icons/128.png",
      default_title: "Bingeflow",
    },
    icons: {
      16: "icons/16.png",
      32: "icons/32.png",
      48: "icons/48.png",
      128: "icons/128.png",
    },
    web_accessible_resources: [
      {
        resources: ["netflix-bridge.js"],
        matches: ["*://*.netflix.com/*"],
      },
    ],
    browser_specific_settings: {
      gecko: {
        id: "bingeflow@malolan.net",
        strict_min_version: "142.0",
        data_collection_permissions: { required: ["none"] },
      },
    },
  },
});
