"use client";

import { type ResourcesConfig } from "aws-amplify";

import { AuthInitializer } from "@workspace/ui/components/auth/auth-initializer";

export type UnauthedProvidersProps = {
  children: React.ReactNode;
  authConfig: ResourcesConfig["Auth"];
};

export function UnauthedProviders({
  children,
  authConfig,
}: UnauthedProvidersProps) {
  return (
    <>
      <AuthInitializer authConfig={authConfig} />
      {children}
    </>
  );
}
