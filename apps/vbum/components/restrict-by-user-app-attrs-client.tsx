"use client";

import { useUserContext } from "@/contexts/user-context";

import { RestrictClient } from "@workspace/ui/components/restrict-client";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";

type props = {
  children: React.ReactNode;
  allowedUserTypes?: UserType[];
  requiredUserRoles?: UserRole[];
  adminOnly?: boolean;
};

/**
 * Restricts rendering of children to users who meet specified attribute and role requirements.
 *
 * Renders the provided children only if the current user satisfies all given access conditions, including admin status, allowed user types, and required roles. Returns null if any condition is not met.
 *
 * @param children - React nodes to render when access is granted.
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

  return (
    <RestrictClient<UserType, UserRole>
      userAppAttrs={usersAppAttrs}
      allowedUserTypes={allowedUserTypes}
      requiredUserRoles={requiredUserRoles}
      adminOnly={adminOnly}
    >
      {children}
    </RestrictClient>
  );
}
