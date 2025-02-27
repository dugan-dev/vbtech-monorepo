export async function Auth({ stage }: { stage: string }) {
  // Create Cognito User Pool
  const userPool = new sst.aws.CognitoUserPool("UserPool", {
    advancedSecurityMode:
      stage === "production" || stage === "staging" ? "enforced" : undefined,
    userNames: ["email"],
    mfa: "on",
    softwareToken: true,
    transform: {
      userPool: (args: any) => {
        args.passwordPolicy = {
          minimumLength: 12,
          passwordHistorySize: 3,
          requireLowercase: true,
          requireNumbers: true,
          requireSymbols: true,
          requireUppercase: true,
          temporaryPasswordValidityDays: 3,
        };
        args.schemas = [
          {
            attributeDataType: "String",
            developerOnlyAttribute: false,
            mutable: true,
            name: "vbtech_apps",
            required: false,
          },
          {
            attributeDataType: "String",
            developerOnlyAttribute: false,
            mutable: true,
            name: "vbpay_userType",
            required: false,
          },
          {
            attributeDataType: "String",
            developerOnlyAttribute: false,
            mutable: true,
            name: "vbpay_entities",
            required: false,
          },
          {
            attributeDataType: "String",
            developerOnlyAttribute: false,
            mutable: true,
            name: "vbpay_roles",
            required: false,
          },
          {
            attributeDataType: "String",
            developerOnlyAttribute: false,
            mutable: true,
            name: "sox_userType",
            required: false,
          },
          {
            attributeDataType: "String",
            developerOnlyAttribute: false,
            mutable: true,
            name: "sox_entities",
            required: false,
          },
          {
            attributeDataType: "String",
            developerOnlyAttribute: false,
            mutable: true,
            name: "sox_roles",
            required: false,
          },
        ];
      },
    },
  });

  // Create Cognito User Pool Client
  const userPoolClient = userPool.addClient("UserPoolClient", {
    transform: {
      client: (args: any) => {
        args.explicitAuthFlows = [
          "ALLOW_USER_SRP_AUTH",
          "ALLOW_REFRESH_TOKEN_AUTH",
        ];
      },
    },
  });

  // Create Cognito Identity Pool
  const identityPool = new sst.aws.CognitoIdentityPool(
    `IdentityPool`,
    {
      userPool: userPool.id,
      client: userPoolClient.id,
    },
    {
      permissions: {
        authenticated: [
          {
            actions: [],
            resources: [],
          },
        ],
      },
    },
  );

  return {
    userPool,
    userPoolClient,
    identityPool,
  };
}
