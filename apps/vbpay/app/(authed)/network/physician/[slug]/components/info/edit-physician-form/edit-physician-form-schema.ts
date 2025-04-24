import * as z from "zod";

import { validateStringIsNumbers } from "@workspace/ui/lib/validateStringIsNumbers";

import { NetworkPhysicianType } from "@/types/network-physician-type";

// Create a more explicit type for soleProprietor field
// This will help with the input/output type consistency
const soleProprietorSchema = z.enum(["yes", "no", ""]).transform((value) => {
  // Transform "" to "no" for the output type
  if (value === "") return "no" as const;
  return value;
});

const EditPhysicianFormSchema = z
  .object({
    taxId: z
      .string()
      .max(10, "Must be 9 digits.")
      .optional()
      .transform((value) => (value === "" ? undefined : value))
      .refine(
        (val) => {
          if (val === "" || val === undefined) {
            return true;
          }
          return validateStringIsNumbers(val.replace("-", ""));
        },
        {
          message: "Must be Numeric.",
        },
      )
      .refine(
        (val) => (val ? val.replace("-", "").length === 9 : true),
        "Must be 9 digits.",
      )
      .transform((val) => val?.replace("-", "")),
    npi: z
      .string()
      .length(10, "Must be 10 digits.")
      .refine(
        (val) => {
          if (val === "" || val === undefined) {
            return true;
          }
          return validateStringIsNumbers(val);
        },
        {
          message: "Must be Numeric.",
        },
      ),
    orgNpi: z
      .string()
      .max(10, "Must be 10 digits.")
      .optional()
      .transform((value) => (value === "" ? undefined : value))
      .refine(
        (val) => {
          if (val === "" || val === undefined) {
            return true;
          }
          return validateStringIsNumbers(val);
        },
        {
          message: "Must be Numeric.",
        },
      )
      .refine((val) => (val ? val.length === 10 : true), "Must be 10 digits."),
    firstName: z.string().min(1, "Required").max(50),
    lastName: z.string().min(1, "Required").max(50),
    type: z.string().min(1, "Required").max(50),
    class: z.string().min(1, "Required").max(50),
    soleProprietor: soleProprietorSchema,
    primaryTaxonomyCode: z
      .string()
      .transform((value) => (value === "" ? undefined : value))
      .optional(),
    specialty: z
      .string()
      .transform((value) => (value === "" ? undefined : value))
      .optional(),
    credential: z
      .string()
      .transform((value) => (value === "" ? undefined : value))
      .optional(),
  })
  .refine(
    (data) => {
      if (data.soleProprietor === "yes" && !data.taxId) {
        return false;
      }
      return true;
    },
    {
      message: "Required.",
      path: ["taxId"],
    },
  )
  .refine(
    (data) => {
      if (
        (data.type as NetworkPhysicianType) !== "individual participant" &&
        !data.orgNpi
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Required.",
      path: ["orgNpi"],
    },
  );

type EditPhysicianFormData = z.infer<typeof EditPhysicianFormSchema>;
type EditPhysicianFormInput = z.input<typeof EditPhysicianFormSchema>;
type EditPhysicianFormOutput = z.output<typeof EditPhysicianFormSchema>;

const EditPhysicianFormDefaultValues: EditPhysicianFormInput = {
  taxId: "",
  npi: "",
  orgNpi: "",
  firstName: "",
  lastName: "",
  type: "",
  class: "",
  soleProprietor: "no",
  primaryTaxonomyCode: "",
  specialty: "",
  credential: "",
};

export {
  EditPhysicianFormDefaultValues,
  EditPhysicianFormSchema,
  type EditPhysicianFormData,
  type EditPhysicianFormInput,
  type EditPhysicianFormOutput,
};
