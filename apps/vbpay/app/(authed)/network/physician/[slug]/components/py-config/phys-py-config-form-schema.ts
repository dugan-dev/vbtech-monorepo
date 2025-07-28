import * as z from "zod/v4";

const PhysPyConfigFormSchema = z.object({
  perfYear: z.string({ message: "Required" }),
  enableCapPayments: z
    .boolean({ message: "Required" })
    .optional()
    .default(false),
  enableClaimPayments: z
    .boolean({ message: "Required" })
    .optional()
    .default(false),
  enableValuePayments: z
    .boolean({ message: "Required" })
    .optional()
    .default(false),
});

type PhysPyConfigFormData = z.infer<typeof PhysPyConfigFormSchema>;
type PhysPyConfigFormInput = z.input<typeof PhysPyConfigFormSchema>;
type PhysPyConfigFormOutput = z.output<typeof PhysPyConfigFormSchema>;

const PhysPyConfigFormDefaultValues: PhysPyConfigFormInput = {
  perfYear: "",
  enableCapPayments: false,
  enableClaimPayments: false,
  enableValuePayments: false,
};

export {
  PhysPyConfigFormDefaultValues,
  PhysPyConfigFormSchema,
  type PhysPyConfigFormData,
  type PhysPyConfigFormInput,
  type PhysPyConfigFormOutput,
};
