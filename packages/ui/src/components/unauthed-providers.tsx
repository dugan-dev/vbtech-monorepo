"use client";

import { PropsWithChildren } from "react";

import { TooltipProvider } from "@workspace/ui/components/tooltip";

type Props = {
  AuthInitializer: React.ComponentType;
  ThemeProvider: React.ComponentType<PropsWithChildren>;
} & PropsWithChildren;

/**
 * Wraps child components with tooltip and theme providers for unauthenticated user flows.
 *
 * @param children - React nodes to be rendered within the composed providers.
 */
export function UnauthedProviders({
  children,
  AuthInitializer,
  ThemeProvider,
}: Props) {
  return (
    <TooltipProvider>
      <AuthInitializer />
      <ThemeProvider>{children}</ThemeProvider>
    </TooltipProvider>
  );
}
