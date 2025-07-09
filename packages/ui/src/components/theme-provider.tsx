import { PropsWithChildren } from "react";
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";

interface CustomThemeProviderProps extends PropsWithChildren {
  defaultTheme?: ThemeProviderProps["defaultTheme"];
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  enableColorScheme?: boolean;
}

export function ThemeProvider({ 
  children,
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = true,
  enableColorScheme = true
}: CustomThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      enableColorScheme={enableColorScheme}
    >
      {children}
    </NextThemesProvider>
  );
}