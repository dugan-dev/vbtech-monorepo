import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";

import { authenticatedUser } from "@/utils/amplify-server-utils";

import { Toaster } from "@workspace/ui/components/sonner";

import { MainSidebar } from "@/components/main-sidebar/main-sidebar";
import { Providers } from "@/components/providers";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await authenticatedUser();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <div className="flex flex-1">
            {user && (
              <MainSidebar
                firstName={"First"}
                lastName={"Last"}
                email={"flast@email.com"}
                userType={"bpo"}
                slug={"test1234"}
                hasLicense={true}
              />
            )}
            <div className="flex-1">
              <div className="h-full overflow-y-auto">{children}</div>
            </div>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
