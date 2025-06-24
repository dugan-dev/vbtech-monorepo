import { z } from "zod";

/**
 * Zod schema for TOTP setup form validation.
 *
 * This schema validates:
 * - Code: 6-digit numeric code from authenticator app
 */
export const TotpSetupFormSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});

/**
 * TypeScript type for the TOTP setup form output.
 */
export type TotpSetupFormOutput = z.infer<typeof TotpSetupFormSchema>;

/**
 * Default values for the TOTP setup form.
 */
export const TotpSetupFormDefaultValues: TotpSetupFormOutput = {
  code: "",
};
