import { forbidden } from "next/navigation";
import { getUserData } from "@/repos/user-repository";

import "server-only";

import { UserAppAttrs } from "@/types/user-app-attrs";
import { UserType } from "@/types/user-type";

type props = {
  children: React.ReactNode;
  allowedUserTypes?: UserType[];
  adminOnly?: boolean;
  passedIsAuthenticated?: boolean;
  passedUsersAppAttrs?: UserAppAttrs;
};

export async function RestrictByUserAppAttrsServer({
  children,
  allowedUserTypes = [],
  adminOnly = false,
  passedIsAuthenticated,
  passedUsersAppAttrs,
}: props) {
  let isAuthenticated = false;
  let usersAppAttrs: UserAppAttrs | null = null;

  if (!passedIsAuthenticated || !passedUsersAppAttrs) {
    const { isAuthenticated: authed, usersAppAttrs: attrs } =
      await getUserData();
    isAuthenticated = authed;
    usersAppAttrs = attrs;
  }

  // Only authenticated users can access this page
  if (!isAuthenticated) {
    return forbidden();
  }

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
