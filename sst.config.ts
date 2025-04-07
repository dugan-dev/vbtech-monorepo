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

  async run() {
    // Determine which infrastructure to deploy based on environment
    const enableVBPay = process.env.VBPAY_ENABLED || false;
    const enableVBLink = process.env.VBLINK_ENABLED || false;
    const enableVBComply = process.env.VBCOMPLY_ENABLED || false;

    const authImport = await import("./infra/auth");
    const Auth = authImport.Auth;

    // If no infrastructure is enabled, throw an error
    if (!enableVBPay && !enableVBLink && !enableVBComply) {
      throw new Error(
        "Missing required environment variable: VBPAY_ENABLED, VBLINK_ENABLED, or VBCOMPLY_ENABLED",
      );
    }

    const client = process.env.VBTECH_CLIENT || undefined;

    if (!client) {
      throw new Error("Missing required environment variable: VBTECH_CLIENT");
    }

    const stage = $app.stage;

    /* const vpc = new sst.aws.Vpc("Vpc", {
      nat: "ec2",
      bastion: true,
      az: stage === "production" ? 2 : 1,
    }); */

    const { userPool, userPoolClient, identityPool } = await Auth({
      stage,
    });

    return {
      userPool,
      userPoolClient,
      identityPool,
      // vpc,
    };
  },
});
