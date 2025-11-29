import { Play } from "next/font/google";

import "@workspace/ui/globals.css";

import { Toaster } from "@workspace/ui/components/sonner";
import { TailwindIndicator } from "@workspace/ui/components/tailwind-indicator";

import { UnauthedProviders } from "@/components/unauthed-providers";

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
        <UnauthedProviders>
          <div className="flex-1">
            <div className="h-full overflow-y-auto">{children}</div>
          </div>
          <Toaster />
          <TailwindIndicator />
        </UnauthedProviders>
      </body>
    </html>
  );
}
