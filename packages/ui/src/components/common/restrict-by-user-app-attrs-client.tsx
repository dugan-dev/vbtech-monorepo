"use client";

type UserAppAttrs<TUserType extends string, TUserRole extends string> = {
  admin: boolean;
  type: TUserType;
  slug?: string;
  ids?: Array<{
    id: string;
    userRoles: TUserRole[];
  }>;
};

type props<TUserType extends string, TUserRole extends string> = {
  children: React.ReactNode;
  allowedUserTypes?: TUserType[];
  requiredUserRoles?: TUserRole[];
  adminOnly?: boolean;
  usersAppAttrs: UserAppAttrs<TUserType, TUserRole>;
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
 * @param usersAppAttrs - User application attributes data.
 *
 * @returns The children if all access conditions are met; otherwise, null.
 */
export function RestrictByUserAppAttrsClient<
  TUserType extends string,
  TUserRole extends string,
>({
  children,
  allowedUserTypes,
  requiredUserRoles,
  adminOnly = false,
  usersAppAttrs,
}: props<TUserType, TUserRole>) {
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
