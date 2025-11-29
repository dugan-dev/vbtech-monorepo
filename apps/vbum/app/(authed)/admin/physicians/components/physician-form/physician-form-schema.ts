import * as z from "zod";

const PhysicianFormSchema = z.object({
  name: z.string().min(1, "Required").max(100),
  clients: z.array(z.string().length(12)).min(1, "Required"),
  rateReview: z.coerce.number().min(0.0, "Review rate must be at least $0.00"),
  rateDenyWithdraw: z.coerce
    .number()
    .min(0.0, "Denial/withdrawal rate must be at least $0.00"),
  rateP2p: z.coerce
    .number()
    .min(0.0, "Peer-to-peer rate must be at least $0.00"),
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
