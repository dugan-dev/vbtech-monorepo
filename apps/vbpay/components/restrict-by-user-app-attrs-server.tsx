import { forbidden } from "next/navigation";
import { getUsersData } from "@/repos/user-repository";

import "server-only";

import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";

type props = {
  children: React.ReactNode;
  userId: string;
  allowedUserTypes?: UserType[];
  adminOnly?: boolean;
  requiredUserRoles?: UserRole[];
};

export async function RestrictByUserAppAttrsServer({
  children,
  userId,
  allowedUserTypes = [],
  adminOnly = false,
  requiredUserRoles = [],
}: props) {
  const { usersAppAttrs } = await getUsersData({
    userId,
  });

  // Only authenticated users with app attributes can access this page
  if (!usersAppAttrs) {
    return forbidden();
  }

  // Only users with the allowed user types can access this page
  if (
    allowedUserTypes.length > 0 &&
    !allowedUserTypes.includes(usersAppAttrs.type)
  ) {
    return forbidden();
  }

  // Only authenticated admin users can access this page
  if (adminOnly && !usersAppAttrs.admin) {
    return forbidden();
  }

  // Only authenticated users with the required user roles can access this page
  if (requiredUserRoles.length > 0) {
    const numIds = usersAppAttrs.ids?.length || 0;
    const id = usersAppAttrs.slug
      ? usersAppAttrs.ids?.find((id) => id.id === usersAppAttrs.slug)
      : numIds === 1
        ? usersAppAttrs.ids?.[0]
        : null;

    if (!requiredUserRoles.every((role) => id?.userRoles.includes(role))) {
      return forbidden();
    }
  }

  return <>{children}</>;
}
