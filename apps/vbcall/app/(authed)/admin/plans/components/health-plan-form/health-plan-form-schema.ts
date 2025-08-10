import * as z from "zod";

const HealthPlanFormSchema = z.object({
  planName: z.string().min(1, "Required").max(255),
  planId: z.string().min(1, "Required").max(10),
  phoneNumber: z.string().min(1, "Required").max(20),
  faxNumber: z.string().min(1, "Required").max(20),
  pbps: z
    .array(
      z.object({
        pbpPubId: z.string(),
        isActive: z.boolean().default(true),
        pbpId: z.string().length(3, "PBP ID must be 3 digits"),
        pbpName: z.string().min(1, "Required"),
      }),
    )
    .min(1, "Required"),
});

type HealthPlanFormData = z.infer<typeof HealthPlanFormSchema>;
type HealthPlanFormInput = z.input<typeof HealthPlanFormSchema>;
type HealthPlanFormOutput = z.output<typeof HealthPlanFormSchema>;

const HealthPlanFormDefaultValues: HealthPlanFormInput = {
  planName: "",
  planId: "",
  phoneNumber: "",
  faxNumber: "",
  pbps: [],
};

export {
  HealthPlanFormDefaultValues,
  HealthPlanFormSchema,
  type HealthPlanFormData,
  type HealthPlanFormInput,
  type HealthPlanFormOutput,
};
