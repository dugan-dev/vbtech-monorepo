"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps the passed children in a theme provider configured for class-based theming.
 *
 * This component leverages NextThemesProvider to automatically apply the user's system theme,
 * enable system theme detection, disable transitions on theme changes, and support color schemes.
 *
 * @param children - The elements to be rendered within the themed context.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      {children}
    </NextThemesProvider>
  );
}
