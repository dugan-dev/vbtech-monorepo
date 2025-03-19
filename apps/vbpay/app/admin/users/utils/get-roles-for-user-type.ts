import {
  UserRole,
  UserRoles,
  UserRolesBpo,
  UserRolesBpoPayerPayers,
  UserRolesPayees,
} from "@/types/user-role";
import { UserType } from "@/types/user-type";

export function getRolesForUserType(userType: UserType) {
  if (userType === "bpo") {
    return UserRolesBpo as unknown as UserRole[];
  } else if (userType === "payer" || userType === "payers") {
    return UserRolesBpoPayerPayers as unknown as UserRole[];
  } else if (
    userType === "physician" ||
    userType === "practice" ||
    userType === "facility" ||
    userType === "po" ||
    userType === "vendor"
  ) {
    return UserRolesPayees as unknown as UserRole[];
  }
  return UserRoles as unknown as UserRole[];
}
