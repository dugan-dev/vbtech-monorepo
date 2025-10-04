"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserContext } from "@/contexts/user-context";
import { APP_NAME } from "@/values/app-name";
import { signOut } from "aws-amplify/auth";
import { ChevronRight, Lock, LogOut } from "lucide-react";

import { UpdatePasswordDialog } from "@workspace/auth/components/update-password-dialog";
import { MainSidebar } from "@workspace/ui/components/main-sidebar/main-sidebar";
import { ThemeToggle } from "@workspace/ui/components/theme-toggle";
import { UserAvatar } from "@workspace/ui/components/user-avatar";

import { AppIcons } from "@/components/app-icons";
import { MAIN_SIDEBAR_CONFIG } from "@/components/main-sidebar/main-sidebar-config";

/**
 * Renders the main sidebar navigation for the VB Utilization Management Eval Tool using the shared MainSidebar component.
 *
 * Passes app-specific configuration, user data, user roles, icons, and UI components to the sidebar.
 */
export function VBUMMainSidebar() {
  const pathname = usePathname();
  const usersData = useUserContext();
  const userAppAttrs = usersData?.usersAppAttrs;
  const rolesForSlug = userAppAttrs?.ids?.find(
    (id) => id.id === userAppAttrs.slug,
  )?.userRoles;

  const config = {
    appTitle: APP_NAME,
    appVersion: "1.0.0",
    navigationItems: MAIN_SIDEBAR_CONFIG,
    hasLicense: true,
  };

  const userData = {
    firstName: usersData.firstName ?? "",
    lastName: usersData.lastName ?? "",
    email: usersData.email ?? "",
  };

  const userAppAttrsForSidebar = {
    type: userAppAttrs?.type || "user",
    roles: rolesForSlug,
    isAdmin: userAppAttrs?.admin || false,
    slug: userAppAttrs?.slug || "",
  };

  const icons = {
    chevronRight: ChevronRight,
    logo: AppIcons.logo,
    logoDark: AppIcons.logoDark,
  };

  const UserAvatarWithProps = (props: {
    firstName: string;
    lastName: string;
    email: string;
  }) => (
    <UserAvatar
      {...props}
      onSignOut={signOut}
      onSignOutComplete={() => {
        window.location.reload();
      }}
      lockIcon={Lock}
      logoutIcon={LogOut}
      updatePasswordDialog={UpdatePasswordDialog}
    />
  );

  const components = {
    ThemeToggle,
    UserAvatar: UserAvatarWithProps,
    Link,
  };

  return (
    <MainSidebar
      config={config}
      userData={userData}
      userAppAttrs={userAppAttrsForSidebar}
      icons={icons}
      components={components}
      pathname={pathname}
    />
  );
}
