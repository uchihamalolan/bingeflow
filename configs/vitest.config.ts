import UnoCSS from "unocss/vite";
import solidPlugin from "vite-plugin-solid";
import { defineConfig } from "vitest/config";
import { WxtVitest } from "wxt/testing/vitest-plugin";

export default defineConfig({
  plugins: [WxtVitest(), solidPlugin(), UnoCSS("configs/uno.config.ts")],
  test: {
    environment: "happy-dom",
  },
});
