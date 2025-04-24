import * as z from "zod";

import { validateStringIsUrl } from "@workspace/ui/lib/validateStringIsUrl";

const EditPayerFormSchema = z.object({
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

type EditPayerFormData = z.infer<typeof EditPayerFormSchema>;
type EditPayerFormInput = z.input<typeof EditPayerFormSchema>;
type EditPayerFormOutput = z.output<typeof EditPayerFormSchema>;

const EditPayerFormDefaultValues: EditPayerFormInput = {
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
  EditPayerFormDefaultValues,
  EditPayerFormSchema,
  type EditPayerFormData,
  type EditPayerFormInput,
  type EditPayerFormOutput,
};
