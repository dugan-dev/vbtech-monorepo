import * as z from "zod";

import { validateStringIsNumbers } from "@workspace/utils/validate-string-is-numbers";

const NppesNetworkEntitySearchFormSchema = z.object({
  orgNpi: z
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
  entityName: z
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
});

type NppesNetworkEntitySearchFormData = z.infer<
  typeof NppesNetworkEntitySearchFormSchema
>;
type NppesNetworkEntitySearchFormInput = z.input<
  typeof NppesNetworkEntitySearchFormSchema
>;
type NppesNetworkEntitySearchFormOutput = z.output<
  typeof NppesNetworkEntitySearchFormSchema
>;

const NppesNetworkEntitySearchFormDefaultValues: NppesNetworkEntitySearchFormInput =
  {
    orgNpi: "",
    entityName: "",
    city: "",
    state: "",
    zip: "",
  };

export {
  NppesNetworkEntitySearchFormDefaultValues,
  NppesNetworkEntitySearchFormSchema,
  type NppesNetworkEntitySearchFormData,
  type NppesNetworkEntitySearchFormInput,
  type NppesNetworkEntitySearchFormOutput,
};
