import { z } from "zod";

type UserRole = "";

const UserRoles = [""] as const;

const UserRoleLabels = {
  "": "",
} as const;

const UserRoleEnum = z.enum(UserRoles);

export { UserRoleEnum, UserRoles, UserRoleLabels, type UserRole };
