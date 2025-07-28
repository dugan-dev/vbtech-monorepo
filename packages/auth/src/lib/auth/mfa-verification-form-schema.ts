import * as z from "zod/v4";

const MfaVerificationFormSchema = z.object({
  code: z.string().length(6, "Code must be 6 characters long"),
});

type MfaVerificationFormData = z.infer<typeof MfaVerificationFormSchema>;
type MfaVerificationFormInput = z.input<typeof MfaVerificationFormSchema>;
type MfaVerificationFormOutput = z.output<typeof MfaVerificationFormSchema>;

const MfaVerificationFormDefaultValues: MfaVerificationFormInput = {
  code: "",
};

export {
  MfaVerificationFormSchema,
  MfaVerificationFormDefaultValues,
  type MfaVerificationFormData,
  type MfaVerificationFormInput,
  type MfaVerificationFormOutput,
};
