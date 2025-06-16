"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserContext } from "@/contexts/user-context";

import { MainSidebar } from "@workspace/ui/components/main-sidebar/main-sidebar";

import { Icons } from "@/components/icons";
import { MAIN_SIDEBAR_CONFIG } from "@/components/main-sidebar/main-sidebar-config";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/user-avatar";

/**
 * Displays the main sidebar navigation for the VB Call application.
 *
 * Uses the shared MainSidebar component with app-specific configuration.
 */
export function VBCallMainSidebar() {
  const pathname = usePathname();
  const usersData = useUserContext();
  const userAppAttrs = usersData?.usersAppAttrs;
  const rolesForSlug = userAppAttrs?.ids?.find(
    (id) => id.id === userAppAttrs.slug,
  )?.userRoles;

  const config = {
    appTitle: "VB Call",
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
    chevronRight: Icons.chevronRight,
    logo: Icons.logo,
    logoDark: Icons.logoDark,
  };

  const components = {
    ThemeToggle,
    UserAvatar,
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
