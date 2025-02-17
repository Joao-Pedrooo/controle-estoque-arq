// eslint.config.cjs
module.exports = [
  // Configuração para arquivos do Browser (ex.: public/js)
  {
    files: ["**/public/js/**/*.js"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020, // Suporta const, let, import/export, etc.
        sourceType: "module", // Habilita módulos ES
      },
      globals: {
        firebase: "readonly",
        bootstrap: "readonly",
        Chart: "readonly",
        $: "readonly",
      },
    },
    env: {
      browser: true,
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
  // Configuração para arquivos Node (ex.: functions e outros)
  {
    files: [
      "**/functions/**/*.{js,ts}",
      "**/controle-estoque-arq/**/*.{js,ts}",
    ],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        module: "readonly",
        require: "readonly",
        process: "readonly",
      },
    },
    env: {
      node: true,
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      // Permite o uso de require() nos arquivos Node
      "@typescript-eslint/no-require-imports": "off",
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
];
