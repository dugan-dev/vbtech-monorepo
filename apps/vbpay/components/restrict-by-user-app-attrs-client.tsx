import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserRole } from "@/types/user-role";
import { UserType } from "@/types/user-type";

type props = {
  children: React.ReactNode;
  usersAppAttrs: UserAppAttrs;
  allowedUserTypes?: UserType[];
  requiredUserRoles?: UserRole[];
  adminOnly?: boolean;
};

export default function RestrictByUserAppAttrsClient({
  children,
  usersAppAttrs,
  allowedUserTypes,
  requiredUserRoles,
  adminOnly = false,
}: props) {
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
