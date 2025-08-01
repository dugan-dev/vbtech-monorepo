import * as z from "zod/v4";

import { validateStringIsNumbers } from "@workspace/utils/validate-string-is-numbers";

const NppesNetworkPhysicianSearchFormSchema = z.object({
  npi: z
    .string()
    .length(10, {
      message: "Must be 10 digits.",
    })
    .refine((npi) => validateStringIsNumbers(npi), {
      message: "Must be numeric.",
    })
    .or(z.literal(""))
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  firstName: z
    .string()
    .min(2, {
      message: "Must be 2 characters or more.",
    })
    .or(z.literal(""))
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  lastName: z
    .string()
    .min(2, {
      message: "Must be 2 characters or more.",
    })
    .or(z.literal(""))
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  city: z
    .string()
    .min(2, {
      message: "Must be 2 characters or more.",
    })
    .or(z.literal(""))
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  state: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  zip: z
    .string()
    .length(5, { message: "Must be 5 digits." })
    .or(z.string().length(9, { message: "Must be 9 digits." }))
    .refine(
      (val) => {
        if (val === "") {
          return true;
        }
        return validateStringIsNumbers(val);
      },
      {
        message: "Must be Numeric.",
      },
    )
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  taxonomy: z
    .string()
    .min(2, {
      message: "Must be 2 characters or more.",
    })
    .or(z.literal(""))
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});

type NppesNetworkPhysicianSearchFormData = z.infer<
  typeof NppesNetworkPhysicianSearchFormSchema
>;
type NppesNetworkPhysicianSearchFormInput = z.input<
  typeof NppesNetworkPhysicianSearchFormSchema
>;
type NppesNetworkPhysicianSearchFormOutput = z.output<
  typeof NppesNetworkPhysicianSearchFormSchema
>;

const NppesNetworkPhysicianSearchFormDefaultValues: NppesNetworkPhysicianSearchFormInput =
  {
    npi: "",
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    zip: "",
    taxonomy: "",
  };

export {
  NppesNetworkPhysicianSearchFormDefaultValues,
  NppesNetworkPhysicianSearchFormSchema,
  type NppesNetworkPhysicianSearchFormData,
  type NppesNetworkPhysicianSearchFormInput,
  type NppesNetworkPhysicianSearchFormOutput,
};
