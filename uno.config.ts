import { defineConfig, presetIcons, presetTypography, transformerVariantGroup } from "unocss";
import presetWind4 from "unocss/preset-wind4";

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
  shortcuts: {
    "card-panel": "flex flex-col gap-5 bg-mantle border-(~ surface0) rounded-2xl p-6",
    "section-title": "text-mauve font-semibold text-lg",
    "setting-row": "flex items-center justify-between gap-5",
    "setting-info": "flex flex-col gap-1 flex-1",
    "setting-label": "font-semibold",
    "shortcut-row":
      "flex items-center justify-between py-2 border-b border-surface0 last:border-none",
    "text-muted": "text-xs text-subtext0",
    "flex-center": "flex items-center justify-center",
    "btn-link": "bg-transparent text-mauve hover:underline text-xs p-0 cursor-pointer",
    "btn-icon-ghost":
      "flex-center text-subtext0 bg-transparent hover:(bg-surface0 text-text) border-none rounded-sm p-1 cursor-pointer",
    "tag-domain":
      "flex items-center gap-2 bg-surface0/70 text-text border-(~ surface1) rounded-lg px-3 py-1.5 text-xs font-mono",
    "toast-base":
      "fixed top-6 right-6 z-[9999] flex items-center gap-2 py-4 px-6 border rounded-xl animate-slideIn",
    "input-clean": "bg-transparent border-none outline-none w-full appearance-none",
    "kbd-badge":
      "bg-surface0 text-text border border-surface1 rounded px-2 py-0.5 text-xs font-mono",
    "state-disabled": "opacity-45 pointer-events-none",
  },
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
