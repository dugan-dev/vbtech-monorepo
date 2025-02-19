"use client";

import * as React from "react";

import { TooltipProvider } from "@workspace/ui/components/tooltip";

/**
 * Wraps the provided children with a tooltip provider.
 *
 * @param children - The content to be rendered within the tooltip provider.
 *
 * @example
 * <Providers>
 *   <App />
 * </Providers>
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
