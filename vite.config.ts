import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    semi: true,
    printWidth: 100,
    sortImports: true,
    sortTailwindcss: true,
    ignorePatterns: [],
  },
  lint: {
    options: { typeAware: true, typeCheck: true },
    jsPlugins: [{ name: "solid", specifier: "eslint-plugin-solid" }],
    plugins: ["eslint", "typescript", "unicorn", "oxc"],
    extends: [],
    rules: {},
    env: {
      builtin: true,
    },
  },
  run: {},
  staged: {},
});
