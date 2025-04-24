import * as z from "zod";

import { UserModeEnum } from "@/types/user-mode";
import { UserRoleEnum } from "@/types/user-role";
import { UserTypeEnum } from "@/types/user-type";

// Define the raw form input type (what react-hook-form will work with)
const UserFormSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().min(1, "Required").email("Invalid email address"),
  type: UserTypeEnum.or(z.literal("")).superRefine((val, ctx) => {
    if (val === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required.",
        path: ["type"],
      });
    }
  }),
  super: z.boolean(),
  admin: z.boolean(),
  ids: z
    .array(
      z.object({
        id: z.string(),
        userMode: UserModeEnum,
        userRoles: z.array(UserRoleEnum),
      }),
    )
    .min(1, "Required"),
});

type UserFormData = z.infer<typeof UserFormSchema>;
type UserFormInput = z.input<typeof UserFormSchema>;
type UserFormOutput = z.output<typeof UserFormSchema>;

const UserFormDefaultValues: UserFormData = {
  type: "",
  email: "",
  firstName: "",
  lastName: "",
  super: false,
  admin: false,
  ids: [],
};

export {
  UserFormDefaultValues,
  UserFormSchema,
  type UserFormData,
  type UserFormInput,
  type UserFormOutput,
};
