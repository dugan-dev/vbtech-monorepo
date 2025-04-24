"use client";

import { PropsWithChildren } from "react";

import { SidebarProvider } from "@workspace/ui/components/sidebar";

import { AuthProvider } from "@/components/auth-provider";

/**
 * Wraps child components with authentication and sidebar context providers.
 *
 * Ensures that all nested components have access to authentication and sidebar-related context.
 *
 * @param children - The components to be rendered within the providers.
 */
export function AuthedProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </AuthProvider>
  );
}
