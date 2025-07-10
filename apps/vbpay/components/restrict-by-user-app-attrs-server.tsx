import { forbidden, redirect, unauthorized } from "next/navigation";
import { getUsersData } from "@/repos/user-repository";

import { RestrictServer } from "@workspace/ui/components/restrict-server";

import "server-only";

import { getVBPayLicense } from "@/repos/license-repository";
import { Setup } from "@/routes";

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
  const [{ usersAppAttrs }, license] = await Promise.all([
    getUsersData({
      userId,
    }),
    getVBPayLicense(),
  ]);

  return (
    <RestrictServer<UserType, UserRole>
      userAppAttrs={usersAppAttrs}
      allowedUserTypes={allowedUserTypes}
      requiredUserRoles={requiredUserRoles}
      adminOnly={adminOnly}
      onUnauthorized={() => unauthorized()}
      onForbidden={() => forbidden()}
      onSetupRequired={() => redirect(Setup({}))}
      requiresSetup={!license}
    >
      {children}
    </RestrictServer>
  );
}
