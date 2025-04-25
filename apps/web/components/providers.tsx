"use client";

import { PropsWithChildren } from "react";

import { TooltipProvider } from "@workspace/ui/components/tooltip";

export function Providers({ children }: PropsWithChildren) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
