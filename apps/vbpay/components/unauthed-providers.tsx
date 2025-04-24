"use client";

import { PropsWithChildren } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { TooltipProvider } from "@workspace/ui/components/tooltip";

import { ThemeProvider } from "@/components/theme-provider";

import { AuthInitializer } from "./auth-initializer";

/**
 * Wraps child components with authentication adapter, tooltip, and theme providers for unauthenticated user flows.
 *
 * @param children - React nodes to be rendered within the composed providers.
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
