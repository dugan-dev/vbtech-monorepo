import { z } from "zod";

/**
 * Zod schema for MFA verification form validation.
 *
 * This schema validates:
 * - Code: 6-digit numeric code from authenticator app
 */
export const MfaVerificationFormSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});

/**
 * TypeScript type for the MFA verification form output.
 */
export type MfaVerificationFormOutput = z.infer<
  typeof MfaVerificationFormSchema
>;

/**
 * Default values for the MFA verification form.
 */
export const MfaVerificationFormDefaultValues: MfaVerificationFormOutput = {
  code: "",
};
