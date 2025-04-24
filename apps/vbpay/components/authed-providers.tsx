"use client";

import { PropsWithChildren } from "react";

import { SidebarProvider } from "@workspace/ui/components/sidebar";

import { AuthProvider } from "@/components/auth-provider";

export function AuthedProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </AuthProvider>
  );
}
