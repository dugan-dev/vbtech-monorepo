"use client";

import { PropsWithChildren } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { TooltipProvider } from "@workspace/ui/components/tooltip";

import { ThemeProvider } from "@/components/theme-provider";

export function UnauthedProviders({ children }: PropsWithChildren) {
  return (
    <NuqsAdapter>
      <TooltipProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </TooltipProvider>
    </NuqsAdapter>
  );
}
