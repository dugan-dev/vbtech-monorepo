import { z } from "zod";

type UserRole =
  | "view"
  | "edit"
  | "add"
  | "approve"
  | "read-files"
  | "write-files"
  | "read-notifications"
  | "write-notifications";

const UserRoles = [
  "view",
  "edit",
  "add",
  "approve",
  "read-files",
  "write-files",
  "read-notifications",
  "write-notifications",
] as const;
const UserRolesBpo = [
  "view",
  "edit",
  "add",
  "read-files",
  "write-files",
  "read-notifications",
  "write-notifications",
] as const;
const UserRolesPayerPayers = [
  "view",
  "edit",
  "add",
  "approve",
  "read-files",
  "write-files",
  "read-notifications",
  "write-notifications",
] as const;
const UserRolesPayees = [
  "view",
  "read-files",
  "write-files",
  "read-notifications",
  "write-notifications",
] as const;

const UserRoleLabels = {
  view: "View",
  edit: "Edit",
  add: "Add",
  approve: "Approve",
  "read-files": "Read Files",
  "write-files": "Write Files",
  "read-notifications": "Read Notifications",
  "write-notifications": "Write Notifications",
} as const;

const UserRoleEnum = z.enum(UserRoles);

export {
  UserRoleEnum,
  UserRoles,
  UserRoleLabels,
  type UserRole,
  UserRolesBpo,
  UserRolesPayerPayers,
  UserRolesPayees,
};
