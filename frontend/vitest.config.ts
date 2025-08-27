import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [vue(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    // define設定を削除し、代わりにsetupFilesを追加
    setupFiles: ["./vitest.setup.ts"],
  },
});
