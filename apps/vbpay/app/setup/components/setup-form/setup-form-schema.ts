import { isDateOnOrAfterToday } from "@/utils/is-date-on-or-after-today";
import * as z from "zod";

import { LicenseFunctionalityEnum } from "@/types/license-functionality";
import { PayerTypeEnum } from "@/types/payer-type";
import { PaymentTypeEnum } from "@/types/payment-type";

const SetupFormSchema = z.object({
  licenseInfo: z
    .object({
      type: z.string().min(1, "Required"),
      numPayers: z
        .string()
        .min(1, "Required")
        .refine((value) => parseInt(value) > 0, "Must be greater than 0"),
      fromDate: z.string().refine(isDateOnOrAfterToday, {
        message: "Must be today or later",
      }),
      toDate: z.string().refine(isDateOnOrAfterToday, {
        message: "Must be today or later",
      }),
      clientName: z.string().min(1, "Required"),
      pocName: z.string().min(1, "Required"),
      pocPhone: z
        .string()
        .regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Must be in (123) 456-7890 format"),
      pocEmail: z.string().email("Invalid email address"),
    })
    .refine((data) => new Date(data.toDate) > new Date(data.fromDate), {
      message: "Must be after the start date",
      path: ["toDate"],
    }),
  functionality: z.object({
    paymentTypes: z.array(PaymentTypeEnum).min(1, "Required"),
    functionality: z.array(LicenseFunctionalityEnum).refine(
      (items) => {
        if (items.length === 0) {
          return false; // Empty array is not allowed
        }
        if (items.includes("none")) {
          return items.length === 1; // If "None" is selected, it must be the only option
        }
        return !items.includes("none"); // Other selections must not include "None"
      },
      {
        message: "Either select specific functionality or choose 'None'",
      },
    ),
  }),
  globalSettings: z.object({
    payerReqTaxId: z.boolean(),
    poReqTaxId: z.boolean(),
    poReqNpi: z.boolean(),
    pracReqNpi: z.boolean(),
    pracReqTaxId: z.boolean(),
    physReqTaxId: z.boolean(),
    physReqCred: z.boolean(),
    physReqSpec: z.boolean(),
    physNppesRecon: z.boolean(),
    faclReqNpi: z.boolean(),
    faclReqTaxId: z.boolean(),
    allowedPayerTypes: z.array(PayerTypeEnum).min(1, "Required"),
  }),
});

type SetupFormData = z.infer<typeof SetupFormSchema>;
type SetupFormInput = z.input<typeof SetupFormSchema>;
type SetupFormOutput = z.output<typeof SetupFormSchema>;

const SetupFormDefaultValues: SetupFormInput = {
  licenseInfo: {
    type: "",
    numPayers: "",
    fromDate: "",
    toDate: "",
    clientName: "",
    pocName: "",
    pocPhone: "",
    pocEmail: "",
  },
  functionality: {
    paymentTypes: [],
    functionality: [],
  },
  globalSettings: {
    allowedPayerTypes: [],
    payerReqTaxId: false,
    poReqTaxId: false,
    poReqNpi: false,
    pracReqNpi: false,
    pracReqTaxId: false,
    physReqTaxId: false,
    physReqCred: false,
    physReqSpec: false,
    physNppesRecon: false,
    faclReqNpi: false,
    faclReqTaxId: false,
  },
};

export {
  SetupFormDefaultValues,
  SetupFormSchema,
  type SetupFormData,
  type SetupFormInput,
  type SetupFormOutput,
};
