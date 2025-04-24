"use client";

import { PropsWithChildren } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { TooltipProvider } from "@workspace/ui/components/tooltip";

import { ThemeProvider } from "@/components/theme-provider";

import { AuthInitializer } from "./auth-initializer";

/**
 * Composes context providers for unauthenticated users, supplying authentication adapter, tooltip, and theming contexts to all child components.
 *
 * @param children - React nodes that will receive the composed contexts.
 */
export function UnauthedProviders({ children }: PropsWithChildren) {
  return (
    <NuqsAdapter>
      <TooltipProvider>
        <AuthInitializer />
        <ThemeProvider>{children}</ThemeProvider>
      </TooltipProvider>
    </NuqsAdapter>
  );
}
