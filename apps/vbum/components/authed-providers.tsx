"use client";

import { PropsWithChildren } from "react";

import { AuthProvider } from "@workspace/auth/components/auth-provider";
import { SidebarProvider } from "@workspace/ui/components/sidebar";

import { useAutoLogout } from "@/hooks/use-auto-logout";

/**
 * Provides authentication and sidebar contexts to all nested child components.
 *
 * Wraps {@link children} with both {@link AuthProvider} and {@link SidebarProvider} to ensure access to authentication and sidebar-related state throughout the component tree.
 *
 * @param children - React nodes to render within the context providers.
 */
export function AuthedProviders({ children }: PropsWithChildren) {
  // Enable auto logout using configured timeout
  useAutoLogout();

  return (
    <AuthProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </AuthProvider>
  );
}
