import { Play } from "next/font/google";

import "@workspace/ui/globals.css";

import { ThemeProvider } from "@workspace/ui/components/auth/theme-provider";
import { UnauthedProviders } from "@workspace/ui/components/auth/unauthed-providers";
import { Toaster } from "@workspace/ui/components/sonner";

import { authConfig } from "@/lib/auth/config";

const fontSans = Play({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "700"],
});

const fontMono = Play({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

/**
 * Provides the root layout for unauthenticated users, applying global fonts, styles, and context providers.
 *
 * Renders the application content within a styled HTML structure and includes a toast notification system.
 *
 * @param children - React nodes to be displayed within the layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UnauthedProviders authConfig={authConfig}>
            <div className="flex-1">
              <div className="h-full overflow-y-auto">{children}</div>
            </div>
            <Toaster />
          </UnauthedProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
