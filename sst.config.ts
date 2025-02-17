/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  /**
   * SST app configuration
   * @param input Configuration input containing stage information
   * @returns SST app configuration object
   */
  app(input) {
    const validStages = ['production', 'staging', 'dev'];
    if (!validStages.includes(input?.stage)) {
      throw new Error(`Invalid stage: ${input?.stage}. Must be one of: ${validStages.join(', ')}`);
    }
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
