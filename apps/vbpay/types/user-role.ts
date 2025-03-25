import { z } from "zod";

type UserRole =
  | "edit"
  | "add"
  | "upload"
  | "approve"
  | "read-files"
  | "write-files"
  | "read-notifications"
  | "write-notifications";

const UserRoles = [
  "edit",
  "add",
  "upload",
  "approve",
  "read-files",
  "write-files",
  "read-notifications",
  "write-notifications",
] as const;

const UserRolesBpo = [
  "edit",
  "add",
  "upload",
  "read-files",
  "write-files",
  "read-notifications",
  "write-notifications",
] as const;
const UserRolesPayerPayers = [
  "edit",
  "add",
  "upload",
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
  edit: "Edit",
  add: "Add",
  upload: "Upload",
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
