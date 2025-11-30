import * as z from "zod";

import { validateStringIsNumbers } from "@workspace/utils/validate-string-is-numbers";

const HealthPlanFormSchema = z.object({
  planName: z.string().min(1, "Required").max(255),
  tatStandard: z
    .string()
    .min(1, "Required")
    .refine((val) => validateStringIsNumbers(val), {
      message: "Must be numeric.",
    })
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  tatExpedited: z
    .string()
    .min(1, "Required")
    .refine((val) => validateStringIsNumbers(val), {
      message: "Must be numeric.",
    })
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
});

type HealthPlanFormData = z.infer<typeof HealthPlanFormSchema>;
type HealthPlanFormInput = z.input<typeof HealthPlanFormSchema>;
type HealthPlanFormOutput = z.output<typeof HealthPlanFormSchema>;

const HealthPlanFormDefaultValues: HealthPlanFormInput = {
  planName: "",
  tatStandard: "",
  tatExpedited: "",
};

export {
  HealthPlanFormDefaultValues,
  HealthPlanFormSchema,
  type HealthPlanFormData,
  type HealthPlanFormInput,
  type HealthPlanFormOutput,
};
