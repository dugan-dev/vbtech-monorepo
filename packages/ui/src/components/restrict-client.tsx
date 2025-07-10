import { ReactNode } from "react";

import { UserAppAttrs } from "../types/user-app-attrs";

type props<TUserType = string, TUserRole = string> = {
  children: ReactNode;
  userAppAttrs: UserAppAttrs<TUserType, TUserRole>;
  allowedUserTypes?: TUserType[];
  requiredUserRoles?: TUserRole[];
  adminOnly?: boolean;
};

/**
 * Restricts rendering of children to users who meet specified attribute and role requirements.
 *
 * Renders the provided children only if the current user satisfies all given access conditions,
 * including admin status, allowed user types, and required roles. Returns null if any condition is not met.
 *
 * @param children - React nodes to render when access is granted.
 * @param userAppAttrs - User application attributes containing admin status, type, and roles.
 * @param allowedUserTypes - List of user types permitted to view the children.
 * @param requiredUserRoles - List of roles the user must have to view the children.
 * @param adminOnly - If true, restricts rendering to admin users only.
 *
 * @returns The children if all access conditions are met; otherwise, null.
 */
export function RestrictClient<TUserType = string, TUserRole = string>({
  children,
  userAppAttrs,
  allowedUserTypes,
  requiredUserRoles,
  adminOnly = false,
}: props<TUserType, TUserRole>) {
  if (adminOnly && !userAppAttrs.admin) {
    return null;
  }

  if (allowedUserTypes && !allowedUserTypes.includes(userAppAttrs.type)) {
    return null;
  }

  if (requiredUserRoles && requiredUserRoles.length > 0) {
    const numIds = userAppAttrs.ids?.length || 0;
    const id = userAppAttrs.slug
      ? userAppAttrs.ids?.find((id) => id.id === userAppAttrs.slug)
      : numIds === 1
        ? userAppAttrs.ids?.[0]
        : null;

    if (!requiredUserRoles.every((role) => id?.userRoles.includes(role))) {
      return null;
    }
  }

  return <>{children}</>;
}
