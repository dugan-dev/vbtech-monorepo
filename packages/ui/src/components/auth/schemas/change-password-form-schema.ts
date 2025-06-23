import { z } from "zod";

/**
 * Zod schema for change password form validation during sign-in.
 *
 * This schema validates:
 * - Password: Minimum 12 characters with complexity requirements
 * - Confirm password: Must match the password field
 */
export const ChangePasswordFormSchema = z
  .object({
    password: z
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
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * TypeScript type for the change password form output.
 */
export type ChangePasswordFormOutput = z.infer<typeof ChangePasswordFormSchema>;

/**
 * Default values for the change password form.
 */
export const ChangePasswordFormDefaultValues: ChangePasswordFormOutput = {
  password: "",
  confirmPassword: "",
};
