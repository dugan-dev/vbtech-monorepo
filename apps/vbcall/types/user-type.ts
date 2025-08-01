import { z } from "zod/v4";

type UserType = "internal";

const UserTypes = ["internal"] as const;

const UserTypeEnum = z.enum(UserTypes);

const UserTypeLabels = {
  internal: "Internal VB Tech User",
};

export { UserTypeEnum, UserTypes, UserTypeLabels, type UserType };
