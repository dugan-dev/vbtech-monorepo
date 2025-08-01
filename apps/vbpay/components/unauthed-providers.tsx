"use client";

import { PropsWithChildren } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { AuthInitializer } from "@workspace/auth/components/auth-initializer";
import { ThemeProvider } from "@workspace/ui/components/theme-provider";
import { TooltipProvider } from "@workspace/ui/components/tooltip";

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
