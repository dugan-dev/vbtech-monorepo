"use client";

import { PropsWithChildren } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { TooltipProvider } from "@workspace/ui/components/tooltip";

import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <NuqsAdapter>
          <TooltipProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </TooltipProvider>
        </NuqsAdapter>
      </SidebarProvider>
    </AuthProvider>
  );
}
