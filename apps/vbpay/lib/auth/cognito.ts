import { env } from "@/env/server";

import { createCognitoClientFromEnv } from "@workspace/auth/lib/auth/cognito";

export const cognitoClient = createCognitoClientFromEnv(env);
