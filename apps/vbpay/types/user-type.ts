import { z } from "zod/v4";

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

export { UserTypeEnum, UserTypes, UserTypeLabels, type UserType };
