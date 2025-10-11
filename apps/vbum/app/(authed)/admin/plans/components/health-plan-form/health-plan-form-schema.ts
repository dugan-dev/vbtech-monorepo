import * as z from "zod";

const HealthPlanFormSchema = z.object({
  planName: z.string().min(1, "Required").max(255),
});

type HealthPlanFormData = z.infer<typeof HealthPlanFormSchema>;
type HealthPlanFormInput = z.input<typeof HealthPlanFormSchema>;
type HealthPlanFormOutput = z.output<typeof HealthPlanFormSchema>;

const HealthPlanFormDefaultValues: HealthPlanFormInput = {
  planName: "",
};

export {
  HealthPlanFormDefaultValues,
  HealthPlanFormSchema,
  type HealthPlanFormData,
  type HealthPlanFormInput,
  type HealthPlanFormOutput,
};
