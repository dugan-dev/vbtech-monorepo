import * as z from "zod";

import { UserTypeEnum } from "@/types/user-type";

// Define the raw form input type (what react-hook-form will work with)
const UserFormSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.email("Invalid email address").min(1, "Required"),
  type: UserTypeEnum.or(z.literal("")).superRefine((val, ctx) => {
    if (val === "") {
      ctx.issues.push({
        code: z.ZodIssueCode.custom,
        message: "Required.",
        path: ["type"],
        input: "",
      });
    }
  }),
  super: z.boolean(),
  admin: z.boolean(),
  ids: z.array(z.string()).min(1, "Required"),
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
