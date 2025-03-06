export async function Auth({ stage }: { stage: string }) {
  // Create DynamoDB Table
  const userPermissionsTable = new sst.aws.Dynamo("UserPermissionsTable", {
    fields: {
      userId: "string", // Partition Key: "<userId> from cognito"
      appName: "string", // Sort Key: "<appId> from Apps type"
      type: "string", // Type assigned to user in the app (e.g., bpo, payer, physicians, etc.)
      entities: "list", // List of entity IDs user can access
      permissions: "map", // Map of entity permissions (e.g., { "Entity_1": ["READ", "WRITE"] })
    },
    primaryIndex: { hashKey: "userId", rangeKey: "appName" },
    globalIndexes: {
      TypeIndex: { hashKey: "type", rangeKey: "userId" },
      EntityIndex: { hashKey: "entities", rangeKey: "userId" },
      PermissionIndex: { hashKey: "permissions", rangeKey: "userId" },
    },
  });

  // Create Cognito User Pool
  const userPool = new sst.aws.CognitoUserPool("UserPool", {
    advancedSecurityMode:
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
    permissions: {
      authenticated: [
        {
          actions: [
            "dynamodb:Query",
            "dynamodb:Scan",
            "dynamodb:GetItem",
            "dynamodb:PutItem",
            "dynamodb:DeleteItem",
            "dynamodb:UpdateItem",
            "dynamodb:BatchGetItem",
            "dynamodb:BatchWriteItem",
          ],
          resources: [userPermissionsTable.table.arn],
        },
      ],
    },
  });

  return {
    userPool,
    userPoolClient,
    identityPool,
    userPermissionsTable,
  };
}
