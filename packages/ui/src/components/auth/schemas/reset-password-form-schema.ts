import { z } from "zod";

/**
 * Zod schema for reset password form validation.
 *
 * This schema validates:
 * - OTP code: 6-digit numeric code
 * - Password: Minimum 8 characters with complexity requirements
 * - Confirm password: Must match the password field
 */
export const ResetPasswordFormSchema = z
  .object({
    code: z
      .string()
      .min(1, "Code is required")
      .regex(/^\d{6}$/, "Code must be 6 digits"),
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
 * TypeScript type for the reset password form output.
 */
export type ResetPasswordFormOutput = z.infer<typeof ResetPasswordFormSchema>;

/**
 * Default values for the reset password form.
 */
export const ResetPasswordFormDefaultValues: ResetPasswordFormOutput = {
  code: "",
  password: "",
  confirmPassword: "",
};
