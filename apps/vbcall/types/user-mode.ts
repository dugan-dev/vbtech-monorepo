import { z } from "zod/v4";

type UserMode = "csr";
const UserModes = ["csr"] as const;

const UserModeLabels = {
  csr: "Customer Service Representative",
};

const UserModeEnum = z.enum(UserModes);

export { UserModeEnum, UserModes, UserModeLabels, type UserMode };
