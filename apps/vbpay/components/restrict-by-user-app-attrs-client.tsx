import { useUserContext } from "@/contexts/user-context";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";

type props = {
  children: React.ReactNode;
  allowedUserTypes?: UserType[];
  requiredUserRoles?: UserRole[];
  adminOnly?: boolean;
};

/**
 * Conditionally renders children based on the current user's attributes and roles.
 *
 * Only renders the children if the user meets all specified restrictions, such as being an admin, having an allowed user type, and possessing all required roles.
 *
 * @param children - The React nodes to render if access is granted.
 * @param allowedUserTypes - Optional list of user types permitted to view the children.
 * @param requiredUserRoles - Optional list of roles the user must have to view the children.
 * @param adminOnly - If true, restricts rendering to admin users only.
 *
 * @returns The children if all access conditions are met; otherwise, returns null.
 */
export default function RestrictByUserAppAttrsClient({
  children,
  allowedUserTypes,
  requiredUserRoles,
  adminOnly = false,
}: props) {
  const userData = useUserContext();
  const usersAppAttrs = userData.usersAppAttrs;

  if (adminOnly && !usersAppAttrs.admin) {
    return null;
  }

  if (allowedUserTypes && !allowedUserTypes.includes(usersAppAttrs.type)) {
    return null;
  }

  if (requiredUserRoles && requiredUserRoles.length > 0) {
    const numIds = usersAppAttrs.ids?.length || 0;
    const id = usersAppAttrs.slug
      ? usersAppAttrs.ids?.find((id) => id.id === usersAppAttrs.slug)
      : numIds === 1
        ? usersAppAttrs.ids?.[0]
        : null;

    if (!requiredUserRoles.every((role) => id?.userRoles.includes(role))) {
      return null;
    }
  }

  return <>{children}</>;
}
