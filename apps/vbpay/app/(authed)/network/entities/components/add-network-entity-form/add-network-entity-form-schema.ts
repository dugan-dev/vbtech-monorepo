import * as z from "zod";

const AddNetworkEntityFormSchema = z.object({
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

type AddNetworkEntityFormData = z.infer<typeof AddNetworkEntityFormSchema>;
type AddNetworkEntityFormInput = z.input<typeof AddNetworkEntityFormSchema>;
type AddNetworkEntityFormOutput = z.output<typeof AddNetworkEntityFormSchema>;

const AddNetworkEntityFormDefaultValues: AddNetworkEntityFormInput = {
  netEntType: "",
  marketingName: "",
  legalName: "",
  referenceName: "",
  orgNpi: "",
  taxId: "",
};

export {
  AddNetworkEntityFormDefaultValues,
  AddNetworkEntityFormSchema,
  type AddNetworkEntityFormData,
  type AddNetworkEntityFormInput,
  type AddNetworkEntityFormOutput,
};
