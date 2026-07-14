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
    version: "0.0.1",
    description: "Automatically skip intros, recaps & control video.",
    homepage_url: "https://github.com/uchihamalolan/bingeflow",
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
        64: "icons/icon-64.png",
        128: "icons/icon-128.png",
        256: "icons/icon-256.png",
      },
    },
  },
});
