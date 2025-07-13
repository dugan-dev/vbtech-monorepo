import * as z from "zod";

const TotpSetupFormSchema = z.object({
  code: z.string().length(6, "Code must be 6 characters long"),
});

type TotpSetupFormData = z.infer<typeof TotpSetupFormSchema>;
type TotpSetupFormInput = z.input<typeof TotpSetupFormSchema>;
type TotpSetupFormOutput = z.output<typeof TotpSetupFormSchema>;

const TotpSetupFormDefaultValues: TotpSetupFormInput = {
  code: "",
};

export {
  TotpSetupFormSchema,
  TotpSetupFormDefaultValues,
  type TotpSetupFormData,
  type TotpSetupFormInput,
  type TotpSetupFormOutput,
};
