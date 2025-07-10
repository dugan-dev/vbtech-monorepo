import { ReactNode } from "react";

import { UserAppAttrs } from "../types/user-app-attrs";

type props<TUserType = string, TUserRole = string> = {
  children: ReactNode;
  userAppAttrs: UserAppAttrs<TUserType, TUserRole> | null;
  allowedUserTypes?: TUserType[];
  requiredUserRoles?: TUserRole[];
  adminOnly?: boolean;
  onUnauthorized: () => ReactNode;
  onForbidden: () => ReactNode;
  onSetupRequired?: () => ReactNode;
  requiresSetup?: boolean;
};

/**
 * Server-side component that restricts rendering of children to users who meet specified
 * attribute and role requirements.
 *
 * Returns appropriate responses (unauthorized, forbidden, setup redirect) based on user
 * permissions and application state. Only renders children if all access conditions are met.
 *
 * @param children - React nodes to render when access is granted.
 * @param userAppAttrs - User application attributes containing admin status, type, and roles.
 * @param allowedUserTypes - List of user types permitted to view the children.
 * @param requiredUserRoles - List of roles the user must have to view the children.
 * @param adminOnly - If true, restricts rendering to admin users only.
 * @param onUnauthorized - Function to call when user is not authenticated.
 * @param onForbidden - Function to call when user lacks required permissions.
 * @param onSetupRequired - Function to call when setup is required (optional).
 * @param requiresSetup - Whether setup is required for access (optional).
 *
 * @returns The children if all access conditions are met; otherwise, appropriate response.
 */
export function RestrictServer<TUserType = string, TUserRole = string>({
  children,
  userAppAttrs,
  allowedUserTypes = [],
  requiredUserRoles = [],
  adminOnly = false,
  onUnauthorized,
  onForbidden,
  onSetupRequired,
  requiresSetup = false,
}: props<TUserType, TUserRole>) {
  // Only authenticated users with app attributes can access this page
  if (!userAppAttrs) {
    return onUnauthorized();
  }

  // If setup is required and not completed, redirect to setup
  if (requiresSetup && onSetupRequired) {
    return onSetupRequired();
  }

  // Only users with the allowed user types can access this page
  if (
    allowedUserTypes.length > 0 &&
    !allowedUserTypes.includes(userAppAttrs.type)
  ) {
    return onForbidden();
  }

  // Only authenticated admin users can access this page
  if (adminOnly && !userAppAttrs.admin) {
    return onForbidden();
  }

  // Only authenticated users with the required user roles can access this page
  if (requiredUserRoles.length > 0) {
    const numIds = userAppAttrs.ids?.length || 0;
    const id = userAppAttrs.slug
      ? userAppAttrs.ids?.find((id) => id.id === userAppAttrs.slug)
      : numIds === 1
        ? userAppAttrs.ids?.[0]
        : null;

    if (!requiredUserRoles.every((role) => id?.userRoles.includes(role))) {
      return onForbidden();
    }
  }

  return <>{children}</>;
}
