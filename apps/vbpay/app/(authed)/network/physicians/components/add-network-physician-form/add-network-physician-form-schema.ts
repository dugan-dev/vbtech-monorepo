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

// Define the schema with the modified soleProprietor field
const AddNetworkPhysicianFormSchema = z
  .object({
    physInfo: z.object({
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
        .refine(
          (val) => (val ? val.length === 10 : true),
          "Must be 10 digits.",
        ),
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
    }),
    affInfo: z.object({
      poNetEntPubId: z
        .string()
        .optional()
        .transform((value) => (value === "" ? undefined : value)),
      faclNetEntPubId: z
        .string()
        .optional()
        .transform((value) => (value === "" ? undefined : value)),
      pracNetEntPubId: z
        .string()
        .optional()
        .transform((value) => (value === "" ? undefined : value)),
      vendorNetEntPubId: z
        .string()
        .optional()
        .transform((value) => (value === "" ? undefined : value)),
      noAffiliates: z.boolean().optional(),
    }),
  })
  .refine(
    (data) => {
      if (data.physInfo.soleProprietor === "yes" && !data.physInfo.taxId) {
        return false;
      }
      return true;
    },
    {
      message: "Required.",
      path: ["physInfo.taxId"],
    },
  )
  .refine(
    (data) => {
      if (
        (data.physInfo.type as NetworkPhysicianType) !==
          "individual participant" &&
        !data.physInfo.orgNpi
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Required.",
      path: ["physInfo.orgNpi"],
    },
  )
  .refine(
    (data) => {
      if (
        data.affInfo.noAffiliates === false &&
        !data.affInfo.poNetEntPubId &&
        !data.affInfo.faclNetEntPubId &&
        !data.affInfo.pracNetEntPubId &&
        !data.affInfo.vendorNetEntPubId
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Select at least one affiliate or check 'No Affiliates'.",
      path: ["affInfo.noAffiliates"],
    },
  );

// Explicitly define the input type (what the form accepts)
type AddNetworkPhysicianFormInput = {
  physInfo: {
    taxId: string;
    npi: string;
    orgNpi: string;
    firstName: string;
    lastName: string;
    type: string;
    class: string;
    soleProprietor: "" | "yes" | "no";
    primaryTaxonomyCode: string;
    specialty: string;
    credential: string;
  };
  affInfo: {
    poNetEntPubId: string;
    faclNetEntPubId: string;
    pracNetEntPubId: string;
    vendorNetEntPubId: string;
    noAffiliates: boolean;
  };
};

// Derive the output type (what the form submits after validation)
type AddNetworkPhysicianFormOutput = z.output<
  typeof AddNetworkPhysicianFormSchema
>;

// The form data type (used for internal processing)
type AddNetworkPhysicianFormData = z.infer<
  typeof AddNetworkPhysicianFormSchema
>;

// Default values matching the input type
const AddNetworkPhysicianFormDefaultValues: AddNetworkPhysicianFormInput = {
  physInfo: {
    taxId: "",
    npi: "",
    orgNpi: "",
    firstName: "",
    lastName: "",
    type: "",
    class: "",
    soleProprietor: "",
    primaryTaxonomyCode: "",
    specialty: "",
    credential: "",
  },
  affInfo: {
    poNetEntPubId: "",
    faclNetEntPubId: "",
    pracNetEntPubId: "",
    noAffiliates: false,
    vendorNetEntPubId: "",
  },
};

export {
  AddNetworkPhysicianFormDefaultValues,
  AddNetworkPhysicianFormSchema,
  type AddNetworkPhysicianFormData,
  type AddNetworkPhysicianFormInput,
  type AddNetworkPhysicianFormOutput,
};
