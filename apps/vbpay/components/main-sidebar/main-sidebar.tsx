"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLicenseContext } from "@/contexts/license-context";
import { useUserContext } from "@/contexts/user-context";

import { ThemeToggle } from "@workspace/ui/components/common/theme-toggle";
import { UpdatePasswordForm } from "@workspace/ui/components/common/update-password-form";
import { UserAvatar } from "@workspace/ui/components/common/user-avatar";
import { MainSidebar } from "@workspace/ui/components/main-sidebar/main-sidebar";

import { Icons } from "@/components/icons";
import { MAIN_SIDEBAR_CONFIG } from "@/components/main-sidebar/main-sidebar-config";
import {
  UpdatePasswordFormDefaultValues,
  UpdatePasswordFormSchema,
  type UpdatePasswordFormInput,
} from "@/components/update-password-form/update-password-form-schema";

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
    chevronRight: Icons.chevronRight,
    logo: Icons.logo,
    logoDark: Icons.logoDark,
  };

  const components = {
    ThemeToggle,
    UserAvatar: () => (
      <UserAvatar
        firstName={userData.firstName}
        lastName={userData.lastName}
        email={userData.email}
        icons={{
          lock: Icons.lock,
          logout: Icons.logout,
        }}
        UpdatePasswordForm={(props) => (
          <UpdatePasswordForm<UpdatePasswordFormInput>
            {...props}
            icons={{ loader: Icons.loader }}
            schema={UpdatePasswordFormSchema}
            defaultValues={UpdatePasswordFormDefaultValues}
          />
        )}
      />
    ),
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
