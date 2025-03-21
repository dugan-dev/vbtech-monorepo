import {
  UserRole,
  UserRolesBpo,
  UserRolesPayees,
  UserRolesPayerPayers,
} from "@/types/user-role";
import { UserType } from "@/types/user-type";

export function getRolesForUserType(userType: UserType) {
  const roleMap: Record<UserType, UserRole[]> = {
    bpo: UserRolesBpo as unknown as UserRole[],
    payers: UserRolesPayerPayers as unknown as UserRole[],
    payer: UserRolesPayerPayers as unknown as UserRole[],
    po: UserRolesPayees as unknown as UserRole[],
    facility: UserRolesPayees as unknown as UserRole[],
    practice: UserRolesPayees as unknown as UserRole[],
    physician: UserRolesPayees as unknown as UserRole[],
    vendor: UserRolesPayees as unknown as UserRole[],
  };

  return roleMap[userType];
}
