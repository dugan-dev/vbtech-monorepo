import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";

import { Toaster } from "@workspace/ui/components/sonner";

import { UnauthedProviders } from "@/components/unauthed-providers";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

/**
 * Provides the global layout for unauthenticated users, applying fonts, styles, context providers, and toast notifications.
 *
 * Wraps the application content with font settings, global styles, and providers for unauthenticated user flows.
 *
 * @param children - React nodes to render within the layout.
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
        <UnauthedProviders>
          <div className="flex-1">
            <div className="h-full overflow-y-auto">{children}</div>
          </div>
          <Toaster />
        </UnauthedProviders>
      </body>
    </html>
  );
}
