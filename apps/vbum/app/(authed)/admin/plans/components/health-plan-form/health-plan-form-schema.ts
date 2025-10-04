import * as z from "zod";

const HealthPlanFormSchema = z.object({
  planName: z.string().min(1, "Required").max(255),
  planId: z.string().min(1, "Required").max(10),
  phoneNumber: z.string().min(1, "Required").max(20),
  faxNumber: z.string().min(1, "Required").max(20),
});

type HealthPlanFormData = z.infer<typeof HealthPlanFormSchema>;
type HealthPlanFormInput = z.input<typeof HealthPlanFormSchema>;
type HealthPlanFormOutput = z.output<typeof HealthPlanFormSchema>;

const HealthPlanFormDefaultValues: HealthPlanFormInput = {
  planName: "",
  planId: "",
  phoneNumber: "",
  faxNumber: "",
};

export {
  HealthPlanFormDefaultValues,
  HealthPlanFormSchema,
  type HealthPlanFormData,
  type HealthPlanFormInput,
  type HealthPlanFormOutput,
};
