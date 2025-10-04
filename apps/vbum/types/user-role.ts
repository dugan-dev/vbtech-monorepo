import { z } from "zod";

type UserRole = "nurse" | "manager" | "admin" | "reporting";

const UserRoles = ["nurse", "manager", "admin", "reporting"] as const;

const UserRoleLabels = {
  nurse: "Nurse",
  manager: "Manager",
  admin: "Admin",
  reporting: "Reporting",
} as const;

const UserRoleEnum = z.enum(UserRoles);

export { UserRoleEnum, UserRoles, UserRoleLabels, type UserRole };
