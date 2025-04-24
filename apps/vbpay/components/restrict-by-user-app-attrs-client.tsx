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
 * Conditionally renders children if the current user meets specified attribute and role restrictions.
 *
 * Renders the provided children only when the user satisfies all of the following (if specified): is an admin (when {@link adminOnly} is true), has a user type included in {@link allowedUserTypes}, and possesses all roles listed in {@link requiredUserRoles}.
 *
 * @param children - React nodes to render if access is granted.
 * @param allowedUserTypes - List of user types permitted to view the children.
 * @param requiredUserRoles - List of roles the user must have to view the children.
 * @param adminOnly - If true, restricts rendering to admin users only.
 *
 * @returns The children if all access conditions are met; otherwise, null.
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
