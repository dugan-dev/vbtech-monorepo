import "server-only";

import { redirect, unauthorized } from "next/navigation";
import { LicenseProvider } from "@/contexts/license-context";
import { SettingsProvider } from "@/contexts/settings-context";
import { UserProvider } from "@/contexts/user-context";
import { getVBPayGlobalSettings } from "@/repos/global-settings-repository";
import { getVBPayLicense } from "@/repos/license-repository";
import { getUsersData } from "@/repos/user-repository";
import { Setup } from "@/routes";

import { authenticatedUser } from "@workspace/auth/lib/server/amplify-server-utils";

import { AuthedProviders } from "@/components/authed-providers";
import { VBPayMainSidebar } from "@/components/main-sidebar/main-sidebar";

/**
 * Renders the authenticated layout, enforcing user authentication and required setup before displaying application content.
 *
 * Wraps children with user, license, and settings context providers, and displays the main sidebar alongside the content area.
 *
 * @param children - The content to render within the authenticated layout.
 * @returns The authenticated layout with all required context providers.
 *
 * @remark Returns an unauthorized response if the user is not authenticated, or redirects to the setup route if license or settings are missing.
 */
export default async function AuthedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, license, settings] = await Promise.all([
    authenticatedUser(),
    getVBPayLicense(),
    getVBPayGlobalSettings(),
  ]);

  if (!user) {
    return unauthorized();
  }

  if (!license || !settings) {
    return redirect(Setup({}));
  }

  const userData = await getUsersData({ userId: user.userId });

  return (
    <AuthedProviders>
      <UserProvider
        usersData={{
          usersAppAttrs: userData.usersAppAttrs,
          firstName: userData.firstName ?? "",
          lastName: userData.lastName ?? "",
          email: userData.email ?? "",
        }}
      >
        <LicenseProvider license={license}>
          <SettingsProvider settings={settings}>
            <div className="flex flex-1">
              <VBPayMainSidebar />
              <div className="flex-1">
                <div className="h-full overflow-y-auto">{children}</div>
              </div>
            </div>
          </SettingsProvider>
        </LicenseProvider>
      </UserProvider>
    </AuthedProviders>
  );
}
