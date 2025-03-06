import * as z from "zod";

const passwordRegex =
  /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z]).{12,}$/;

const ChangePasswordFormSchema = z
  .object({
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
