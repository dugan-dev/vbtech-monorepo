import {
  SidebarNavItem,
  UserAttributes,
} from "@workspace/ui/types/sidebar-nav-item";

/**
 * Returns a filtered list of sidebar navigation items that the specified user is permitted to access, including recursively filtered nested items.
 *
 * @param navigationItems - The sidebar navigation items to filter.
 * @param userAttributes - The user's roles, type, and admin status used to determine access.
 * @returns Sidebar navigation items allowed for the user, with nested items filtered according to the same rules.
 */
export function filterSidebarItems<TUserRole = string, TUserType = string>(
  navigationItems: SidebarNavItem<TUserRole, TUserType>[],
  userAttributes: UserAttributes<TUserRole, TUserType>,
): SidebarNavItem<TUserRole, TUserType>[] {
  return navigationItems
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
 * Determines whether a sidebar navigation item is accessible to a user based on their attributes.
 *
 * The item is allowed if the user meets all of the following, when specified:
 * - Is an admin if the item is admin-only.
 * - Has a user type included in the item's allowed user types.
 * - Possesses at least one of the item's required roles.
 *
 * @returns `true` if the user is permitted to access the item; otherwise, `false`.
 */
function isItemAllowedForUser<TUserRole, TUserType>(
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
    !item.allowedUserTypes.includes(userAttributes.type)
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
