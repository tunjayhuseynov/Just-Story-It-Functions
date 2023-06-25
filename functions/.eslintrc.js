module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  ignorePatterns: [
    'node_modules/',
    '**/node_modules/',
    '/**/node_modules/*',
    "/lib/**/*", // Ignore built files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": 0,
    "import/no-unresolved": 0,
    "object-curly-spacing": 0,
    "semi": 0,
    "linebreak-style": 0,
    "indent": 0,
    "max-len": 0,
    "require-jsdoc": 0,
    "comma-dangle": 0,
    "eol-last": 0,
    "new-cap": 0,
    "no-multiple-empty-lines": 0,
    "padded-blocks": 0,
    "brace-style": 0,
    "arrow-parens": 0,
    "no-trailing-spaces": 0,
    "camelcase": 0
  },
};
