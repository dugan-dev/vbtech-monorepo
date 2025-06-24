"use client";

import { useUserContext } from "@/contexts/user-context";

import { RestrictByUserAppAttrsClient as UIRestrictByUserAppAttrsClient } from "@workspace/ui/components/common/restrict-by-user-app-attrs-client";

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
export default function RestrictByUserAppAttrsClient(props: props) {
  const userData = useUserContext();
  return (
    <UIRestrictByUserAppAttrsClient<UserType, UserRole>
      {...props}
      usersAppAttrs={userData.usersAppAttrs}
    />
  );
}
