import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

type props = {
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_SESSION_TOKEN: string;
};

// Since both apps use identical environment variables, provide a direct export
// Apps can import this directly instead of creating their own wrapper
export function createCognitoClientFromEnv({
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_SESSION_TOKEN,
}: props) {
  return new CognitoIdentityProviderClient({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      sessionToken: AWS_SESSION_TOKEN,
    },
  });
}
