import * as z from "zod";

import { validateStringIsUrl } from "@workspace/utils/validate-string-is-url";

const AddPayerFormSchema = z.object({
  payerType: z.string().refine(
    (type) => {
      return type !== "";
    },
    {
      message: "Required",
    },
  ),
  initPerfYr: z.string().refine(
    (year) => {
      return year !== "";
    },
    {
      message: "Required",
    },
  ),
  initPerfMo: z.string().refine(
    (month) => {
      return month !== "";
    },
    {
      message: "Required",
    },
  ),
  cmsId: z
    .string()
    .optional()
    .transform((value) => (value === "" ? undefined : value))
    .refine(
      (cmsId) => {
        if (cmsId) {
          return cmsId.length === 5;
        }
        return true;
      },
      {
        message: "Must be 5 characters.",
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
  parentOrgName: z
    .string()
    .max(255)
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  websiteUrl: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? undefined : value))
    .refine(
      (url) => {
        if (url) {
          return validateStringIsUrl(url);
        }
        return true;
      },
      {
        message: "Must be a valid URL.",
      },
    ),
});

type AddPayerFormData = z.infer<typeof AddPayerFormSchema>;
type AddPayerFormInput = z.input<typeof AddPayerFormSchema>;
type AddPayerFormOutput = z.output<typeof AddPayerFormSchema>;

const AddPayerFormDefaultValues: AddPayerFormInput = {
  payerType: "",
  initPerfYr: "",
  initPerfMo: "",
  cmsId: "",
  marketingName: "",
  legalName: "",
  referenceName: "",
  taxId: "",
  parentOrgName: "",
  websiteUrl: "",
};

export {
  AddPayerFormDefaultValues,
  AddPayerFormSchema,
  type AddPayerFormData,
  type AddPayerFormInput,
  type AddPayerFormOutput,
};
