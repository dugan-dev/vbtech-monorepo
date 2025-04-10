import * as z from "zod";

const PayerPyConfigFormSchema = z.object({
  basicInfo: z.object({
    perfYear: z.string().min(1, "Required"),
    program: z.string().min(1, "Required"),
    type: z.string().min(1, "Required"),
    riskOption: z.string().min(1, "Required"),
    paymentModel: z.string().min(1, "Required"),
    eligSource: z.string().min(1, "Required"),
  }),
  physAssignment: z
    .object({
      isRequired: z.boolean({ required_error: "Required" }),
      physAssignSource: z
        .string()
        .transform((val) => (val === "" ? undefined : val))
        .optional(),
      physAssignMethod: z
        .string()
        .transform((val) => (val === "" ? undefined : val))
        .optional(),
    })
    .refine(
      ({ isRequired, physAssignSource }) => !isRequired || physAssignSource,
      {
        message: "Required",
        path: ["physAssignSource"],
      },
    )
    .refine(
      ({ isRequired, physAssignMethod }) => !isRequired || physAssignMethod,
      {
        message: "Required",
        path: ["physAssignMethod"],
      },
    ),
});

type PayerPyConfigFormData = z.infer<typeof PayerPyConfigFormSchema>;
type PayerPyConfigFormInput = z.input<typeof PayerPyConfigFormSchema>;
type PayerPyConfigFormOutput = z.output<typeof PayerPyConfigFormSchema>;

const PayerPyConfigFormDefaultValues: PayerPyConfigFormInput = {
  basicInfo: {
    perfYear: "",
    program: "",
    type: "",
    riskOption: "",
    paymentModel: "",
    eligSource: "",
  },
  physAssignment: {
    isRequired: false,
  },
};

export {
  PayerPyConfigFormDefaultValues,
  PayerPyConfigFormSchema,
  type PayerPyConfigFormData,
  type PayerPyConfigFormInput,
  type PayerPyConfigFormOutput,
};
