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
  type UserAttributes,
} from "@workspace/ui/types/sidebar-nav-item";

import { filterSidebarItems } from "./filter-sidebar-items";
import { getCookieValue, setCookieValue } from "./main-sidebar-cookies";

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

/**
 * Renders a customizable main sidebar with navigation, user info, and theme toggle for applications.
 *
 * Displays app-specific navigation items, supports collapsible groups with state persisted in cookies, and shows user details in the footer. Navigation items are filtered based on user attributes, and items can be conditionally enabled or disabled depending on app license status.
 *
 * @remark Collapsible navigation group open/close state is persisted per app title using cookies.
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
    setCookieValue(config.appTitle, openItems);
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

  const hasLicense = config.hasLicense ?? false; // Default to false if not specified

  // Handle collapsible item toggle
  const handleItemToggle = (id: string, isOpen: boolean) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: isOpen,
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
              {appSidebarNavItems?.map((item) => (
                <SidebarMenuItem key={item.id}>
                  {item.items ? (
                    <Collapsible
                      open={openItems[item.id] ?? false}
                      onOpenChange={(isOpen) =>
                        handleItemToggle(item.id, isOpen)
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
