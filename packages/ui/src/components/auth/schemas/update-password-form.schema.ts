import { z } from "zod";

/**
 * Zod schema for update password form validation in user profile.
 *
 * This schema validates:
 * - Current password: Required field
 * - New password: Minimum 12 characters with complexity requirements
 * - Confirm password: Must match the new password field
 */
export const UpdatePasswordFormSchema = z
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

/**
 * TypeScript types for the update password form.
 */
export type UpdatePasswordFormData = z.infer<typeof UpdatePasswordFormSchema>;
export type UpdatePasswordFormInput = z.input<typeof UpdatePasswordFormSchema>;
export type UpdatePasswordFormOutput = z.output<
  typeof UpdatePasswordFormSchema
>;

/**
 * Default values for the update password form.
 */
export const UpdatePasswordFormDefaultValues: UpdatePasswordFormInput = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};
