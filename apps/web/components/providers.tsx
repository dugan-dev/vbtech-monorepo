"use client";

import * as React from "react";

import { ThemeProvider } from "@workspace/ui/components/theme-provider";

/**
 * Wraps the provided children with a theme provider to manage the application's theme settings.
 *
 * This component renders its children within the ThemeProvider, which applies themes via a CSS class.
 * It sets the default theme to "light" and enables the use of the CSS `color-scheme` property.
 *
 * @param children - The content to be rendered within the theme provider.
 *
 * @example
 * <Providers>
 *   <App />
 * </Providers>
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}
