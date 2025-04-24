"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLicenseContext } from "@/contexts/license-context";
import { useUserContext } from "@/contexts/user-context";
import { filterMainSidebarItems } from "@/utils/filter-main-sidebar-items";
import { useTheme } from "next-themes";

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
import { useIsMounted } from "@workspace/ui/hooks/use-is-mounted";

import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/user-avatar";

/**
 * Displays the main sidebar navigation for the application, including navigation links, theme toggle, and user information.
 *
 * Navigation items and interactivity are dynamically adjusted based on the user's license status and roles, with user details sourced from context providers.
 */
export function MainSidebar() {
  const usersData = useUserContext();
  const license = useLicenseContext();

  const hasLicense = !!license;

  const userAppAttrs = usersData?.usersAppAttrs;
  const mounted = useIsMounted();
  const rolesForSlug = userAppAttrs?.ids?.find(
    (id) => id.id === userAppAttrs.slug,
  )?.userRoles;
  const appSidebarNavItems = userAppAttrs
    ? filterMainSidebarItems({
        type: userAppAttrs.type,
        roles: rolesForSlug,
        isAdmin: userAppAttrs.admin,
        slug: userAppAttrs.slug,
      })
    : [];
  const { theme } = useTheme();
  const pathname = usePathname();

  return (
    <Sidebar className="border-r" title="Main App Sidebar">
      <SidebarHeader className="pt-3">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between">
            {hasLicense ? (
              <SidebarMenuButton size="lg" asChild>
                <Link href="/" data-testid="app-sidebar-logo-link">
                  {mounted ? (
                    theme === "dark" ? (
                      <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-white text-primary-foreground">
                        <Icons.logo width={32} height={32} />
                      </div>
                    ) : (
                      <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Icons.logoDark width={32} height={32} />
                      </div>
                    )
                  ) : (
                    <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Icons.logoDark width={32} height={32} />
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span
                      className="font-semibold"
                      data-testid="app-sidebar-title"
                    >
                      VB Pay
                    </span>
                    <span data-testid="app-sidebar-version">v1.0.0</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton size="lg" disabled={!hasLicense}>
                {mounted ? (
                  theme === "dark" ? (
                    <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-white text-primary-foreground">
                      <Icons.logo width={32} height={32} />
                    </div>
                  ) : (
                    <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Icons.logoDark width={32} height={32} />
                    </div>
                  )
                ) : (
                  <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Icons.logoDark width={32} height={32} />
                  </div>
                )}
                <div className="flex flex-col gap-0.5 leading-none">
                  <span
                    className="font-semibold"
                    data-testid="app-sidebar-title"
                  >
                    VB Pay
                  </span>
                  <span data-testid="app-sidebar-version">v1.0.0</span>
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
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          size="lg"
                          className="text-lg"
                          data-testid={`app-sidebar-menu-item-${item.title.toLowerCase()}`}
                          disabled={!hasLicense}
                          data-disabled={!hasLicense}
                        >
                          {item.icon && <item.icon className="mr-2" />}
                          <span>{item.title}</span>
                          <Icons.chevronDown className="ml-auto" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem, subIndex) => (
                            <SidebarMenuSubItem key={subIndex}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.href}
                                className="text-lg"
                                data-testid={`app-sidebar-submenu-item-${subItem.title.toLowerCase()}`}
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
                      data-testid={`app-sidebar-menu-item-${item.title.toLowerCase()}`}
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
                      data-testid={`app-sidebar-menu-item-${item.title.toLowerCase()}`}
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
            firstName={usersData.firstName}
            lastName={usersData.lastName}
            email={usersData.email}
          />
          <div className="min-w-0 flex-1">
            <p
              className="max-w-[180px] truncate text-sm font-medium"
              data-testid="app-sidebar-user-name"
            >
              {`${usersData.firstName} ${usersData.lastName}`}
            </p>
            <p
              className="max-w-[180px] truncate text-xs text-muted-foreground"
              data-testid="app-sidebar-user-email"
            >
              {usersData.email}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
