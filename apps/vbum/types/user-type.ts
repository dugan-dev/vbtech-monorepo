import { z } from "zod";

type UserType = "nurse" | "auditor" | "ops" | "reporting";

const UserTypes = ["nurse", "auditor", "ops", "reporting"] as const;

const UserTypeEnum = z.enum(UserTypes);

const UserTypeLabels = {
  nurse: "Nurse",
  auditor: "Auditor",
  ops: "Operations",
  reporting: "Reporting",
};

export { UserTypeEnum, UserTypes, UserTypeLabels, type UserType };
