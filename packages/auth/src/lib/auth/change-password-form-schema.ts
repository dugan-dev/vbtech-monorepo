import * as z from "zod";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_MESSAGE,
  PASSWORD_REGEX,
  PASSWORD_REQUIREMENTS_MESSAGE,
  PASSWORDS_MUST_MATCH_MESSAGE,
} from "./password-validation";

const ChangePasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE)
      .refine(
        (value) => PASSWORD_REGEX.test(value),
        PASSWORD_REQUIREMENTS_MESSAGE,
      ),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH, "Required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: PASSWORDS_MUST_MATCH_MESSAGE,
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof ChangePasswordFormSchema>;
type ChangePasswordFormInput = z.input<typeof ChangePasswordFormSchema>;
type ChangePasswordFormOutput = z.output<typeof ChangePasswordFormSchema>;

const ChangePasswordFormDefaultValues: ChangePasswordFormInput = {
  password: "",
  confirmPassword: "",
};

export {
  ChangePasswordFormSchema,
  ChangePasswordFormDefaultValues,
  type ChangePasswordFormData,
  type ChangePasswordFormInput,
  type ChangePasswordFormOutput,
};
