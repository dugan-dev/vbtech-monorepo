"use client";

import { ThemeProvider } from "@workspace/ui/components/auth/theme-provider";

type props = {
  children: React.ReactNode;
};

export function UnauthedProviders({ children }: props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
