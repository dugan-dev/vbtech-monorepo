import * as z from "zod/v4";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_MESSAGE,
  PASSWORD_REGEX,
  PASSWORD_REQUIREMENTS_MESSAGE,
  PASSWORDS_MUST_MATCH_MESSAGE,
} from "./auth/password-validation";

const UpdatePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE),
    newPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE)
      .refine(
        (value) => PASSWORD_REGEX.test(value),
        PASSWORD_REQUIREMENTS_MESSAGE,
      ),
    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: PASSWORDS_MUST_MATCH_MESSAGE,
    path: ["confirmPassword"],
  });

type UpdatePasswordFormData = z.infer<typeof UpdatePasswordFormSchema>;
type UpdatePasswordFormInput = z.input<typeof UpdatePasswordFormSchema>;
type UpdatePasswordFormOutput = z.output<typeof UpdatePasswordFormSchema>;

const UpdatePasswordFormDefaultValues: UpdatePasswordFormInput = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export {
  UpdatePasswordFormSchema,
  UpdatePasswordFormDefaultValues,
  type UpdatePasswordFormData,
  type UpdatePasswordFormInput,
  type UpdatePasswordFormOutput,
};
