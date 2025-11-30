"use client";

import { PropsWithChildren } from "react";

import { AuthProvider } from "@workspace/auth/components/auth-provider";
import { SidebarProvider } from "@workspace/ui/components/sidebar";

import { useAutoLogout } from "@/hooks/use-auto-logout";

import { QueryProvider } from "./query-provider";

/**
 * Provides authentication, React Query, and sidebar contexts to all nested child components.
 *
 * Wraps {@link children} with {@link AuthProvider}, {@link QueryProvider}, and {@link SidebarProvider}
 * to ensure access to authentication, client-side caching, and sidebar-related state throughout the component tree.
 *
 * @param children - React nodes to render within the context providers.
 */
export function AuthedProviders({ children }: PropsWithChildren) {
  // Enable auto logout using configured timeout
  useAutoLogout();

  return (
    <AuthProvider>
      <QueryProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </QueryProvider>
    </AuthProvider>
  );
}
