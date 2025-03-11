import { z } from "zod";

type UserMode = "aco"; // TODO: add additional modes to match payer types as we support additional modes.

const UserModes = ["aco"] as const;

const UserModeLabels = {
  aco: "ACO",
};

const UserModeEnum = z.enum(UserModes);

type UserType =
  | "vendor"
  | "physician"
  | "practice"
  | "facility"
  | "po"
  | "payers"
  | "payer"
  | "bpo";

const UserTypes = [
  "vendor",
  "physician",
  "practice",
  "facility",
  "po",
  "payers",
  "payer",
  "bpo",
] as const;

const UserTypeEnum = z.enum(UserTypes);

const UserTypeLabels = {
  vendor: "Vendor",
  physician: "Physician",
  practice: "Practice",
  facility: "Facility",
  po: "Phys Org",
  payers: "Payers",
  payer: "Payer",
  bpo: "BPO",
};

export {
  UserModeEnum,
  UserModes,
  UserModeLabels,
  UserTypeEnum,
  UserTypes,
  UserTypeLabels,
  type UserMode,
  type UserType,
};
