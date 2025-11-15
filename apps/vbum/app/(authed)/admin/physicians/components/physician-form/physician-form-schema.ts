import * as z from "zod";

const PhysicianFormSchema = z.object({
  name: z.string().min(1, "Required").max(100),
  clients: z.array(z.string().length(12)).min(1, "Required"),
  rateReview: z.coerce
    .number()
    .positive("Review rate must be positive.")
    .min(0.01, "Review rate must be at least $0.01"),
  rateDenyWithdraw: z.coerce
    .number()
    .positive("Denial/withdrawal rate must be positive.")
    .min(0.01, "Denial/withdrawal rate must be at least $0.01"),
  rateP2p: z.coerce
    .number()
    .positive("Peer-to-peer rate must be positive.")
    .min(0.01, "Peer-to-peer rate must be at least $0.01"),
  notes: z
    .string()
    .max(1000)
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  isActive: z.boolean(),
});

type PhysicianFormData = z.infer<typeof PhysicianFormSchema>;
type PhysicianFormInput = z.input<typeof PhysicianFormSchema>;
type PhysicianFormOutput = z.output<typeof PhysicianFormSchema>;

const PhysicianFormDefaultValues: PhysicianFormInput = {
  name: "",
  clients: [],
  rateReview: "",
  rateDenyWithdraw: "",
  rateP2p: "",
  notes: "",
  isActive: true,
};

export {
  PhysicianFormDefaultValues,
  PhysicianFormSchema,
  type PhysicianFormData,
  type PhysicianFormInput,
  type PhysicianFormOutput,
};
