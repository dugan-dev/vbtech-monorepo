import { nextJsConfig } from "@workspace/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
const config = [
  ...nextJsConfig,
  {
    rules: {
      "react/no-unknown-property": [
        "warn",
        {
          ignore: ["pl-input"],
        },
      ],
    },
  },
];

export default config;
