"use client";

import * as React from "react";

import { TooltipProvider } from "@workspace/ui/components/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
