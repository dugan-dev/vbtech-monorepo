"use client";

import { useEffect } from "react";
import { Amplify } from "aws-amplify";

import { authConfig } from "@/lib/auth/config";

/**
 * Initializes AWS Amplify authentication configuration on component mount.
 *
 * @remark This component does not render any UI and should be included once at the root of your application to ensure authentication is set up.
 */
export function AuthInitializer() {
  useEffect(() => {
    Amplify.configure({ Auth: authConfig }, { ssr: true });
  }, []);

  return null;
}
