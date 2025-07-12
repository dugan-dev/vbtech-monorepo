import * as z from "zod";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_MESSAGE,
  PASSWORD_REGEX,
  PASSWORD_REQUIREMENTS_MESSAGE,
  PASSWORDS_MUST_MATCH_MESSAGE,
} from "./password-validation";

const ResetPasswordFormSchema = z
  .object({
    code: z.string(),
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

type ResetPasswordFormData = z.infer<typeof ResetPasswordFormSchema>;
type ResetPasswordFormInput = z.input<typeof ResetPasswordFormSchema>;
type ResetPasswordFormOutput = z.output<typeof ResetPasswordFormSchema>;

const ResetPasswordFormDefaultValues: ResetPasswordFormInput = {
  code: "",
  password: "",
  confirmPassword: "",
};

export {
  ResetPasswordFormSchema,
  ResetPasswordFormDefaultValues,
  type ResetPasswordFormData,
  type ResetPasswordFormInput,
  type ResetPasswordFormOutput,
};
