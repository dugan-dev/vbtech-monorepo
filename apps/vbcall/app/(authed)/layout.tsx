import "server-only";

import { unauthorized } from "next/navigation";
import { UserProvider } from "@/contexts/user-context";
import { getUsersData } from "@/repos/user-repository";
import { authenticatedUser } from "@/utils/amplify-server-utils";

import { AuthedProviders } from "@/components/authed-providers";
import { VBCallMainSidebar } from "@/components/main-sidebar/main-sidebar";

/**
 * Serves as the authenticated layout for the application, ensuring user authentication and setup prerequisites before rendering content.
 *
 * Wraps its children with user context providers, and displays the main sidebar alongside the content area.
 *
 * @param children - The content to render within the authenticated layout.
 * @returns The authenticated layout with all required context providers.
 *
 * @remark Redirects to the setup route if license or settings are missing, or returns an unauthorized response if the user is not authenticated.
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
        <div className="flex flex-1">
          <VBCallMainSidebar />
          <div className="flex-1">
            <div className="h-full overflow-y-auto">{children}</div>
          </div>
        </div>
      </UserProvider>
    </AuthedProviders>
  );
}
