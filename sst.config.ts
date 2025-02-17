/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "vbtech-monorepo",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: "us-west-2",
          profile:
            input.stage === "production"
              ? "prod1"
              : input.stage === "staging"
                ? "non-prod1"
                : "dev",
        },
      },
    };
  },
  async run() {},
});
