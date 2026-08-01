import solidPlugin from "vite-plugin-solid";
import { defineConfig } from "vitest/config";
import { WxtVitest } from "wxt/testing/vitest-plugin";

export default defineConfig({
  plugins: [WxtVitest(), solidPlugin()],
  test: {
    environment: "happy-dom",
  },
});
