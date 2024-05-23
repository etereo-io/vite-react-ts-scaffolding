/* eslint-disable @typescript-eslint/no-var-requires */
const imports = require("./config/eslint/imports.cjs");
const react = require("./config/eslint/react-ts.cjs");
const typescript = require("./config/eslint/typescript.cjs");

module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
    ...imports.env,
    ...typescript.env,
    ...react.env,
  },
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react-hooks/recommended"],
  ignorePatterns: ["dist"],
  plugins: [...imports.plugins, ...typescript.plugins, ...react.plugins, "react-refresh"],
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    ...imports.rules,
    ...typescript.rules,
    ...react.rules,
  },
  settings: {
    ...react.settings,
  },
  overrides: [...typescript.overrides],
};
