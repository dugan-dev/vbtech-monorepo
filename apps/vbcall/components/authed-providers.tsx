"use client";

import { PropsWithChildren } from "react";

import { SidebarProvider } from "@workspace/ui/components/sidebar";

import { AuthProvider } from "@/components/auth-provider";

/**
 * Provides authentication and sidebar contexts to all nested child components.
 *
 * Wraps {@link children} with both {@link AuthProvider} and {@link SidebarProvider} to ensure access to authentication and sidebar-related state throughout the component tree.
 *
 * @param children - React nodes to render within the context providers.
 */
export function AuthedProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </AuthProvider>
  );
}
