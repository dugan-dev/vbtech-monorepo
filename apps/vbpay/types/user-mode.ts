import { z } from "zod/v4";

type UserMode = "aco"; // TODO: add additional modes to match payer types as we support additional modes.

const UserModes = ["aco"] as const;

const UserModeLabels = {
  aco: "ACO",
};

const UserModeEnum = z.enum(UserModes);

export { UserModeEnum, UserModes, UserModeLabels, type UserMode };
