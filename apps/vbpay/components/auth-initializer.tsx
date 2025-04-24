"use client";

import { useEffect } from "react";
import { Amplify } from "aws-amplify";

import { authConfig } from "@/lib/auth/config";

/**
 * Initializes AWS Amplify authentication with the provided configuration when the component mounts.
 *
 * @remark
 * This component does not render any UI and should be included once in the component tree to ensure Amplify Auth is configured on the client side.
 */
export function AuthInitializer() {
  useEffect(() => {
    Amplify.configure({ Auth: authConfig }, { ssr: true });
  }, []);

  return null;
}
