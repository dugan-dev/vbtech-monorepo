import { SidebarNavItem } from "@/types/sidebar-nav-item";
import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";
import { MAIN_SIDEBAR_CONFIG } from "@/components/main-sidebar/main-sidebar-config";

interface UserAttributes {
  type: UserType;
  roles?: UserRole[];
  isAdmin?: boolean;
  slug?: string;
}

/**
 * Filters the main sidebar navigation items to include only those accessible to the specified user.
 *
 * For each sidebar item and its nested items, checks user permissions and attributes to determine visibility.
 *
 * @param userAttributes - The attributes of the user used to determine sidebar access.
 * @returns An array of sidebar navigation items permitted for the user, with nested items filtered accordingly.
 */
export function filterMainSidebarItems(
  userAttributes: UserAttributes,
): SidebarNavItem[] {
  return MAIN_SIDEBAR_CONFIG.filter((item) =>
    isItemAllowedForUser(item, userAttributes),
  )
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
    .filter(Boolean) as SidebarNavItem[];
}

function isItemAllowedForUser(
  item: SidebarNavItem,
  userAttributes: UserAttributes,
): boolean {
  // Check if item is admin-only
  if (item.isAdminOnly && !userAttributes.isAdmin) {
    return false;
  }

  // Check user type restrictions
  if (
    item.allowedUserTypes &&
    !item.allowedUserTypes.includes(userAttributes.type as UserType)
  ) {
    return false;
  }

  // Check required roles
  if (item.requiredRoles) {
    const hasRequiredRole = item.requiredRoles.some((role) =>
      userAttributes.roles?.includes(role),
    );
    if (!hasRequiredRole) {
      return false;
    }
  }

  return true;
}
