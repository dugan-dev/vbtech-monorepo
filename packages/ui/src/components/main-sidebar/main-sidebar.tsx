"use client";

import { useEffect, useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar";
import {
  MainSidebarConfig,
  type SidebarNavItem,
  type UserAttributes,
} from "@workspace/ui/types/sidebar-nav-item";

type props<TUserRole = string, TUserType = string> = {
  config: MainSidebarConfig<TUserRole, TUserType>;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
  };
  userAppAttrs?: {
    type: TUserType;
    roles?: TUserRole[];
    isAdmin?: boolean;
    slug?: string;
  };
  icons: {
    chevronDown: React.ElementType;
    chevronRight: React.ElementType;
    logo: React.ElementType;
    logoDark: React.ElementType;
  };
  components: {
    ThemeToggle: React.ElementType;
    UserAvatar: React.ElementType;
    Link: React.ElementType;
  };
  pathname: string;
};

// Cookie utilities for state persistence
const COOKIE_MAX_AGE = 60 * 15; // 15 minutes (5 minutes after auto-logout)

function getCookieName(appTitle: string): string {
  const cookieName = `sidebar-collapsible-state-${appTitle.toLowerCase().replace(/\s+/g, "-")}`;
  // Debug log for development
  if (process.env.NODE_ENV === "development") {
    console.log(`[MainSidebar] Cookie name for "${appTitle}": ${cookieName}`);
  }
  return cookieName;
}

function getCookieValue(appTitle: string): Record<string, boolean> {
  if (typeof document === "undefined") return {};

  const cookieName = getCookieName(appTitle);
  const cookies = document.cookie.split(";");
  const cookie = cookies.find((c) => c.trim().startsWith(`${cookieName}=`));

  if (!cookie) return {};

  try {
    const value = cookie.split("=")[1];
    if (!value) return {};
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return {};
  }
}

function setCookieValue(
  appTitle: string,
  value: Record<string, boolean>,
): void {
  if (typeof document === "undefined") return;

  const cookieName = getCookieName(appTitle);
  const cookieValue = encodeURIComponent(JSON.stringify(value));
  document.cookie = `${cookieName}=${cookieValue}; path=/; max-age=${COOKIE_MAX_AGE}`;
}

/**
 * Clears the sidebar collapsible state cookie for a specific app.
 * Call this function when the user logs out to reset the sidebar state.
 */
export function clearSidebarState(appTitle: string): void {
  if (typeof document === "undefined") return;

  const cookieName = getCookieName(appTitle);
  // Clear the cookie by setting it to expire in the past
  document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Filters sidebar navigation items based on user attributes.
 * This is a generic filtering function that can be used across different applications.
 */
function filterSidebarItems<TUserRole = string, TUserType = string>(
  items: SidebarNavItem<TUserRole, TUserType>[],
  userAttributes: UserAttributes<TUserRole, TUserType>,
): SidebarNavItem<TUserRole, TUserType>[] {
  return items
    .filter((item) => isItemAllowedForUser(item, userAttributes))
    .map((item) => {
      // If the item has nested items, filter those as well
      if (item.items) {
        const filteredNestedItems = item.items.filter((nestedItem) =>
          isItemAllowedForUser(nestedItem, userAttributes),
        );

        // Only return the parent item if it has nested items or if it doesn't require nested items
        return filteredNestedItems.length > 0 || !item.items
          ? { ...item, items: filteredNestedItems }
          : null;
      }
      return item;
    })
    .filter(Boolean) as SidebarNavItem<TUserRole, TUserType>[];
}

/**
 * Checks if a sidebar item is allowed for the given user attributes.
 */
function isItemAllowedForUser<TUserRole = string, TUserType = string>(
  item: SidebarNavItem<TUserRole, TUserType>,
  userAttributes: UserAttributes<TUserRole, TUserType>,
): boolean {
  // Check if item is admin-only
  if (item.isAdminOnly && !userAttributes.isAdmin) {
    return false;
  }

  // Check user type restrictions
  if (
    item.allowedUserTypes &&
    !item.allowedUserTypes.includes(userAttributes.type as TUserType)
  ) {
    return false;
  }

  // Check required roles
  if (item.requiredRoles) {
    const hasRequiredRole = item.requiredRoles.some((role) =>
      userAttributes.roles?.includes(role as TUserRole),
    );
    if (!hasRequiredRole) {
      return false;
    }
  }

  return true;
}

/**
 * Generic main sidebar component that can be used across different applications.
 *
 * Takes app-specific configuration and maintains all existing styling, icons, animations, and functionality.
 * Now includes state persistence for collapsible items and smooth animations.
 *
 * @param config - App-specific configuration including title, version, logo, and navigation items
 * @param userData - User information for the footer
 * @param userAppAttrs - User application attributes for filtering navigation items
 * @param icons - App-specific icons including chevronDown and chevronRight
 * @param components - App-specific components like ThemeToggle, UserAvatar, and Link
 * @param pathname - App-specific pathname
 */
export function MainSidebar<TUserRole = string, TUserType = string>({
  config,
  userData,
  userAppAttrs,
  icons,
  components,
  pathname,
}: props<TUserRole, TUserType>) {
  const { ThemeToggle, UserAvatar, Link } = components;
  const { chevronRight: ChevronRight, logo: Logo, logoDark: LogoDark } = icons;

  // State for collapsible items
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      return getCookieValue(config.appTitle);
    }
    return {};
  });

  // Save state to cookie whenever it changes
  useEffect(() => {
    if (Object.keys(openItems).length > 0) {
      setCookieValue(config.appTitle, openItems);
    }
  }, [openItems, config.appTitle]);

  // Get user attributes for filtering
  const userAttributes: UserAttributes<TUserRole, TUserType> = {
    type: userAppAttrs?.type as TUserType,
    roles: userAppAttrs?.roles,
    isAdmin: userAppAttrs?.isAdmin || false,
    slug: userAppAttrs?.slug || "",
  };

  // Filter navigation items based on user attributes
  const appSidebarNavItems = filterSidebarItems(
    config.navigationItems,
    userAttributes,
  );

  const hasLicense = config.hasLicense ?? true; // Default to true if not specified

  // Handle collapsible item toggle
  const handleItemToggle = (itemTitle: string, isOpen: boolean) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemTitle]: isOpen,
    }));
  };

  return (
    <Sidebar className="border-r" title="Main App Sidebar">
      <SidebarHeader className="pt-3">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between">
            {hasLicense ? (
              <SidebarMenuButton size="lg" asChild>
                <Link href="/">
                  <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-accent">
                    <Logo
                      width={32}
                      height={32}
                      className="block dark:hidden"
                    />
                    <LogoDark
                      width={32}
                      height={32}
                      className="hidden dark:block"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">{config.appTitle}</span>
                    <span>{config.appVersion}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton size="lg" disabled={!hasLicense}>
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Logo width={32} height={32} className="block dark:hidden" />
                  <LogoDark
                    width={32}
                    height={32}
                    className="hidden dark:block"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{config.appTitle}</span>
                  <span>{config.appVersion}</span>
                </div>
              </SidebarMenuButton>
            )}
            <div className="mr-2">
              <ThemeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="py-12">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {appSidebarNavItems?.map((item, index) => (
                <SidebarMenuItem key={index}>
                  {item.items ? (
                    <Collapsible
                      open={openItems[item.title] ?? false}
                      onOpenChange={(isOpen) =>
                        handleItemToggle(item.title, isOpen)
                      }
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          size="lg"
                          className="text-lg group"
                          disabled={!hasLicense}
                          data-disabled={!hasLicense}
                        >
                          {item.icon && <item.icon className="mr-2" />}
                          <span>{item.title}</span>
                          <div className="ml-auto">
                            <ChevronRight className="h-4 w-4 sidebar-chevron" />
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="CollapsibleContent">
                        <SidebarMenuSub>
                          {item.items.map((subItem, subIndex) => (
                            <SidebarMenuSubItem key={subIndex}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.href}
                                className="text-lg"
                              >
                                <Link href={subItem.href || ""}>
                                  {subItem.icon && (
                                    <subItem.icon className="mr-2" />
                                  )}
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : hasLicense ? (
                    <SidebarMenuButton
                      size="lg"
                      asChild
                      isActive={pathname === item.href}
                      className="text-lg"
                    >
                      <Link href={item.href ?? ""}>
                        {item.icon && <item.icon className="mr-2" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton
                      size="lg"
                      isActive={pathname === item.href}
                      className="text-lg"
                      disabled={true}
                      data-disabled="true"
                    >
                      {item.icon && <item.icon className="mr-2" />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="mb-4 mt-4 flex items-center gap-4 px-4">
          <UserAvatar
            firstName={userData.firstName}
            lastName={userData.lastName}
            email={userData.email}
          />
          <div className="min-w-0 flex-1">
            <p className="max-w-[180px] truncate text-sm font-medium">
              {userData.firstName} {userData.lastName}
            </p>
            <p className="max-w-[180px] truncate text-xs text-muted-foreground">
              {userData.email}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
