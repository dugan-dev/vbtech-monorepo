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

  if (
    requiredUserRoles &&
    !requiredUserRoles.every((role) =>
      usersAppAttrs?.ids
        ?.find((id) => id.id === usersAppAttrs.slug)
        ?.userRoles.includes(role),
    )
  ) {
    return null;
  }

  return <>{children}</>;
}
