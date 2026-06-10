import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    ignores: ["node_modules/", "dist/"],
    rules: {
      "no-console": "warn",
      "prefer-const": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      quotes: [2, "single"],
    },
  },
  eslintConfigPrettier,
);
