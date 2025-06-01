import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {
      "react/react-in-jsx-scope": "off", // Next.js does not require React to be in scope
      "no-unused-vars": "warn", // Warn on unused variables
      "@next/next/no-img-element": "off", // Allow usage of <img> elements
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ], // Ignore unused vars that start with _
      "@typescript-eslint/no-explicit-any": "off", // Allow usage of 'any' type
    },
  }),
];

export default eslintConfig;
