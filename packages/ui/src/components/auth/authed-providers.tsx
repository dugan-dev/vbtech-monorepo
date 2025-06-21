"use client";

import { AuthProvider } from "@workspace/ui/components/auth/auth-provider";
import { ThemeProvider } from "@workspace/ui/components/auth/theme-provider";

type props = {
  children: React.ReactNode;
};

export function AuthedProviders({ children }: props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider getUser={async () => null}>{children}</AuthProvider>
    </ThemeProvider>
  );
}
