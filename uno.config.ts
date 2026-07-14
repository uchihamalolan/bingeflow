import presetWind4 from "@unocss/preset-wind4";
import { defineConfig, presetIcons, presetTypography, transformerVariantGroup } from "unocss";

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons({
      prefix: "i-",
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
    presetTypography(),
  ],
  transformers: [transformerVariantGroup()],
  theme: {
    colors: {
      base: "var(--base)",
      mantle: "var(--mantle)",
      crust: "var(--crust)",
      surface0: "var(--surface0)",
      surface1: "var(--surface1)",
      surface2: "var(--surface2)",
      overlay0: "var(--overlay0)",
      text: "var(--text)",
      subtext0: "var(--subtext0)",
      mauve: "var(--mauve)",
      blue: "var(--blue)",
      green: "var(--green)",
      red: "var(--red)",
      peach: "var(--peach)",
    },
    animation: {
      keyframes: {
        slideIn:
          "{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}",
      },
      durations: {
        slideIn: "0.2s",
      },
      timingFns: {
        slideIn: "cubic-bezier(0, 0, 0, 1)",
      },
    },
  },
});
