import { getCurrentUser as amplifyGetCurrentUser } from "aws-amplify/auth";

import { AuthUser } from "@workspace/ui/components/auth/auth-provider";

export async function getCurrentUser(): Promise<AuthUser> {
  try {
    const user = await amplifyGetCurrentUser();
    if (!user || !user.userId || !user.username || !user.signInDetails)
      return null;
    const { loginId, authFlowType } = user.signInDetails;
    if (!loginId || !authFlowType) return null;
    return {
      userId: user.userId,
      username: user.username,
      signInDetails: { loginId, authFlowType },
    };
  } catch {
    return null;
  }
}
