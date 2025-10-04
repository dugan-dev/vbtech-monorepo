import { forbidden, unauthorized } from "next/navigation";
import { getUsersData } from "@/repos/user-repository";

import { RestrictServer } from "@workspace/ui/components/restrict-server";

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

  return (
    <RestrictServer<UserType, UserRole>
      userAppAttrs={usersAppAttrs}
      allowedUserTypes={allowedUserTypes}
      requiredUserRoles={requiredUserRoles}
      adminOnly={adminOnly}
      onUnauthorized={() => unauthorized()}
      onForbidden={() => forbidden()}
    >
      {children}
    </RestrictServer>
  );
}
