/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    const validStages = ["production", "staging", "dev"];
    if (!validStages.includes(input?.stage)) {
      throw new Error(
        `Invalid stage: ${input?.stage}. Must be one of: ${validStages.join(", ")}`,
      );
    }
    const AWS_PROFILES = {
      production: "prod1",
      staging: "non-prod1",
      dev: "dev",
    } as const;

    const AWS_REGIONS = {
      production: "us-west-2",
      staging: "us-west-2",
      dev: "us-west-2",
    } as const;

    const PROTECTED_STAGES = ["production"] as const;

    return {
      name: "vbtech-monorepo",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: PROTECTED_STAGES.includes(
        input.stage as (typeof PROTECTED_STAGES)[number],
      ),
      home: "aws",
      providers: {
        aws: {
          region: AWS_REGIONS[input.stage as keyof typeof AWS_REGIONS],
          profile: AWS_PROFILES[input.stage as keyof typeof AWS_PROFILES],
        },
      },
    };
  },

  async run() {},
});
