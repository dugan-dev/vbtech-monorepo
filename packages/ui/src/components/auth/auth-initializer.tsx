"use client";

import { useEffect } from "react";
import { Amplify, type ResourcesConfig } from "aws-amplify";

type Props = {
  authConfig: ResourcesConfig["Auth"];
};

/**
 * Initializes AWS Amplify authentication configuration on component mount.
 *
 * @remark This component does not render any UI and should be included once at the root of your application to ensure authentication is set up.
 */
export function AuthInitializer({ authConfig }: Props) {
  useEffect(() => {
    Amplify.configure({
      Auth: authConfig,
    });
  }, [authConfig]);

  return null;
}
