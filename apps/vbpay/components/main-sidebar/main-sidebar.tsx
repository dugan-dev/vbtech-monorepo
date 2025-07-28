"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLicenseContext } from "@/contexts/license-context";
import { useUserContext } from "@/contexts/user-context";
import { signOut } from "aws-amplify/auth";
import { ChevronRight, Lock, LogOut } from "lucide-react";

import { UpdatePasswordDialog } from "@workspace/auth/components/update-password-dialog";
import { MainSidebar } from "@workspace/ui/components/main-sidebar/main-sidebar";
import { ThemeToggle } from "@workspace/ui/components/theme-toggle";
import { UserAvatar } from "@workspace/ui/components/user-avatar";

import { AppIcons } from "@/components/app-icons";
import { MAIN_SIDEBAR_CONFIG } from "@/components/main-sidebar/main-sidebar-config";

/**
 * Renders the main sidebar navigation for the VB Pay application using the shared MainSidebar component.
 *
 * Passes user context, license status, app-specific configuration, and UI components to the sidebar for display and navigation.
 */
export function VBPayMainSidebar() {
  const pathname = usePathname();
  const usersData = useUserContext();
  const license = useLicenseContext();
  const hasLicense = !!license;

  const userAppAttrs = usersData?.usersAppAttrs ?? null;
  const rolesForSlug = userAppAttrs?.ids?.find(
    (id) => id.id === userAppAttrs.slug,
  )?.userRoles;

  const config = {
    appTitle: "VB Pay",
    appVersion: "1.0.0",
    navigationItems: MAIN_SIDEBAR_CONFIG(userAppAttrs?.slug),
    hasLicense,
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
