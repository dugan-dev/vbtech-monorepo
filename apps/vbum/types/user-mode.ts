import { z } from "zod";

type UserMode = "";
const UserModes = [""] as const;

const UserModeLabels = {
  "": "",
};

const UserModeEnum = z.enum(UserModes);

export { UserModeEnum, UserModes, UserModeLabels, type UserMode };
