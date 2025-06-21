"use client";

import { getCurrentUser as amplifyGetCurrentUser } from "aws-amplify/auth";

import { AuthProvider as UIAuthProvider } from "@workspace/ui/components/auth/auth-provider";

type props = {
  children: React.ReactNode;
};

async function getCurrentUser() {
  try {
    const user = await amplifyGetCurrentUser();
    if (!user || !user.userId || !user.username || !user.signInDetails)
      return null;
    // signInDetails may have different keys, so map them if needed
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

export function AuthProvider({ children }: props) {
  return <UIAuthProvider getUser={getCurrentUser}>{children}</UIAuthProvider>;
}
