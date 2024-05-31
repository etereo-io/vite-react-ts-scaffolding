module.exports = {
  env: {
    browser: true,
  },
  plugins: ["@typescript-eslint", "react-hooks", "react"],
  rules: {
    "react-hooks/rules-of-hooks": ["error"],
    "react-hooks/exhaustive-deps": ["error"],
    "@typescript-eslint/naming-convention": [
      "warn",
      {
        selector: "memberLike",
        modifiers: ["private"],
        format: ["camelCase"],
        leadingUnderscore: "forbid",
        trailingUnderscore: "forbid",
      },
      {
        selector: ["enumMember"],
        format: ["UPPER_CASE"],
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
      {
        selector: "function",
        format: ["PascalCase", "camelCase"],
      },
    ],
    "react/no-danger-with-children": ["error"],
    "react/no-direct-mutation-state": ["error"],
    "react/no-redundant-should-component-update": ["warn"],
    "react/no-typos": ["warn"],
    "react/no-unknown-property": ["warn"],
    "react/no-unused-prop-types": ["warn"],
    "react/no-unused-state": ["warn"],
    "react/no-will-update-set-state": ["error"],
    "react/require-render-return": ["error"],
    "react/void-dom-elements-no-children": ["warn"],
    "react/jsx-key": ["warn"],
    "react/jsx-no-comment-textnodes": ["warn"],
    "react/jsx-no-duplicate-props": ["warn"],
    "react/jsx-no-undef": [
      "error",
      {
        allowGlobals: true,
      },
    ],
    "react/jsx-uses-react": ["warn"],
    "react/jsx-uses-vars": ["warn"],
    "react/prefer-read-only-props": ["warn"],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
