import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";

import { Providers } from "@/components/providers";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

/**
 * Defines the root layout for the application.
 *
 * Sets up the HTML structure with the language attribute set to "en" and suppresses hydration warnings.
 * Applies global font and antialiasing styles to the body element and wraps the provided children
 * with a context provider for shared state and settings.
 *
 * @param children - The component tree to render within the layout.
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
