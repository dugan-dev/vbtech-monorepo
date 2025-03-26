import { forbidden } from "next/navigation";
import { getUsersData } from "@/repos/user-repository";

import "server-only";

import { UserType } from "@/types/user-type";

type props = {
  children: React.ReactNode;
  userId: string;
  allowedUserTypes?: UserType[];
  adminOnly?: boolean;
};

export async function RestrictByUserAppAttrsServer({
  children,
  userId,
  allowedUserTypes = [],
  adminOnly = false,
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
    !allowedUserTypes.length &&
    !allowedUserTypes.includes(usersAppAttrs.type)
  ) {
    return forbidden();
  }

  // Only authenticated admin users can access this page
  if (adminOnly && !usersAppAttrs.admin) {
    return forbidden();
  }

  return <>{children}</>;
}
