import * as z from "zod/v4";

const EditEntityFormSchema = z.object({
  netEntType: z.string().refine(
    (type) => {
      return type !== "";
    },
    {
      message: "Required",
    },
  ),
  marketingName: z.string().min(1, "Required").max(255),
  legalName: z
    .string()
    .max(255)
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  referenceName: z
    .string()
    .max(20)
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  orgNpi: z
    .string()
    .optional()
    .transform((value) => (value === "" ? undefined : value))
    .refine(
      (orgNpi) => {
        if (orgNpi) {
          return orgNpi.length === 10;
        }
        return true;
      },
      {
        message: "Must be 10 digits.",
      },
    ),
  taxId: z
    .string()
    .optional()
    .transform((value) => (value === "" ? undefined : value?.replace("-", "")))
    .refine(
      (taxId) => {
        if (taxId) {
          return taxId.length === 9;
        }
        return true;
      },
      {
        message: "Must be 9 digits.",
      },
    ),
});

type EditEntityFormData = z.infer<typeof EditEntityFormSchema>;
type EditEntityFormInput = z.input<typeof EditEntityFormSchema>;
type EditEntityFormOutput = z.output<typeof EditEntityFormSchema>;

const EditEntityFormDefaultValues: EditEntityFormInput = {
  netEntType: "",
  marketingName: "",
  legalName: "",
  referenceName: "",
  orgNpi: "",
  taxId: "",
};

export {
  EditEntityFormDefaultValues,
  EditEntityFormSchema,
  type EditEntityFormData,
  type EditEntityFormInput,
  type EditEntityFormOutput,
};
