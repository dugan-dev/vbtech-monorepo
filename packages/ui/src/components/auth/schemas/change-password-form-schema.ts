import { z } from "zod";

/**
 * Zod schema for change password form validation.
 *
 * This schema validates:
 * - Password: Minimum 8 characters with complexity requirements
 * - Confirm password: Must match the password field
 */
export const ChangePasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
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
