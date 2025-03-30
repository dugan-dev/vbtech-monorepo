import "server-only";

import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";

import { getUsersData } from "@/repos/user-repository";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { Toaster } from "@workspace/ui/components/sonner";

import { UserAppAttrs } from "@/types/user-app-attrs";
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

  let firstName = "";
  let lastName = "";
  let email = "";
  let usersAppAttrs: UserAppAttrs | null = null;

  if (user) {
    const {
      firstName: fName,
      lastName: lName,
      email: uEmail,
      usersAppAttrs: uAppAttrs,
    } = await getUsersData({
      userId: user.userId,
    });

    firstName = fName || "";
    lastName = lName || "";
    email = uEmail || "";
    usersAppAttrs = uAppAttrs;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <div className="flex flex-1">
            {user && usersAppAttrs && (
              <MainSidebar
                firstName={firstName || ""}
                lastName={lastName || ""}
                email={email || ""}
                hasLicense={true}
                userAppAttrs={usersAppAttrs}
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
