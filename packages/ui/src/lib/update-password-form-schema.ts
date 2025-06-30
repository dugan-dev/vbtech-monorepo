import * as z from "zod";

const UpdatePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(12, "Password must be at least 12 characters"),
    newPassword: z
      .string()
      .min(12, "Password must be at least 12 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z
      .string()
      .min(12, "Password must be at least 12 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
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
