import "server-only";

import { unauthorized } from "next/navigation";
import { UserProvider } from "@/contexts/user-context";
import { getUsersData } from "@/repos/user-repository";
import { authenticatedUser } from "@/utils/amplify-server-utils";
import { APP_NAME } from "@/values/app-name";

import { AuthedProviders } from "@workspace/ui/components/auth/authed-providers";
import { ThemeProvider } from "@workspace/ui/components/auth/theme-provider";
import { getCurrentUser } from "@workspace/ui/utils/get-current-user";

import { VBCallMainSidebar } from "@/components/main-sidebar/main-sidebar";

/**
 * Renders the authenticated application layout, enforcing user authentication and providing user context to its children.
 *
 * Wraps the content with authentication and user data providers, and displays the main sidebar alongside the main content area.
 *
 * @param children - The content to display within the authenticated layout.
 * @returns The authenticated layout with all necessary context providers.
 *
 * @remark Returns an unauthorized response if the user is not authenticated.
 */
export default async function AuthedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await authenticatedUser();

  if (!user) {
    return unauthorized();
  }

  const userData = await getUsersData({ userId: user.userId });

  // Note: useRouter is not available in server components, so redirectToSignIn must be a no-op or handled in client
  const authProviderConfig = {
    getCurrentUser,
    redirectToSignIn: () => {}, // No-op for SSR, handled in client
    appName: APP_NAME,
    autoLogoutMinutes: 10,
    checkOnVisibilityChange: true,
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthedProviders authProviderConfig={authProviderConfig}>
        <UserProvider
          usersData={{
            usersAppAttrs: userData.usersAppAttrs,
            firstName: userData.firstName ?? "",
            lastName: userData.lastName ?? "",
            email: userData.email ?? "",
          }}
        >
          <div className="flex flex-1">
            <VBCallMainSidebar />
            <div className="flex-1">
              <div className="h-full overflow-y-auto">{children}</div>
            </div>
          </div>
        </UserProvider>
      </AuthedProviders>
    </ThemeProvider>
  );
}
