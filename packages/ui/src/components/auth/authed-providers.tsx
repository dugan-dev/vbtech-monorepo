"use client";

import { ReactNode } from "react";

import {
  AuthProvider,
  AuthProviderConfig,
} from "@workspace/ui/components/auth/auth-provider";

type Props = {
  children: ReactNode;
  authProviderConfig: AuthProviderConfig;
};

/**
 * Provides authentication context to all nested child components.
 *
 * Wraps {@link children} with {@link AuthProvider} to ensure access to authentication state throughout the component tree.
 *
 * @param children - React nodes to render within the context providers.
 * @param authProviderConfig - Configuration for the AuthProvider
 */
export function AuthedProviders({ children, authProviderConfig }: Props) {
  return <AuthProvider config={authProviderConfig}>{children}</AuthProvider>;
}
