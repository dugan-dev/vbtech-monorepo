import * as z from "zod";

const passwordRegex =
  /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z]).{12,}$/;

const ResetPasswordFormSchema = z
  .object({
    code: z.string(),
    password: z
      .string()
      .min(12, "Password must be at least 12 characters long")
      .refine(
        (value) => passwordRegex.test(value),
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      ),
    confirmPassword: z.string().min(12, "Required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
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
