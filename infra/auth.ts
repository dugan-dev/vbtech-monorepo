export async function Auth({ stage }: { stage: string }) {
  // Create Cognito User Pool
  const userPool = new sst.aws.CognitoUserPool("UserPool", {
    advancedSecurity:
      stage === "production" || stage === "staging" ? "enforced" : undefined,
    usernames: ["email"],
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
        // Generate 50 custom attributes (app1:attrs through app50:attrs)
        args.schemas = Array.from({ length: 50 }, (_, i) => ({
          attributeDataType: "String",
          name: `app${i + 1}:attrs`,
          developerOnlyAttribute: false,
          mutable: true,
          required: false,
        }));
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
  const identityPool = new sst.aws.CognitoIdentityPool("IdentityPool", {
    userPools: [
      {
        userPool: userPool.id,
        client: userPoolClient.id,
      },
    ],
    /*
    permissions: {
      authenticated: [
        {
          actions: [],
          resources: [],
        },
      ],
    },
    */
  });

  return {
    userPool,
    userPoolClient,
    identityPool,
  };
}
