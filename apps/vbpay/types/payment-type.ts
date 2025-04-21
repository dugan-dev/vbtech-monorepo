import { z } from "zod";

type PaymentTypeType = "capitation" | "ffs replacement" | "value based";

const PaymentTypes = ["capitation", "ffs replacement", "value based"] as const;

const PaymentTypeEnum = z.enum(PaymentTypes);

const PaymentTypeLabels = {
  capitation: "Capitation",
  "ffs replacement": "FFS Replacement",
  "value based": "Value Based",
};

type PaymentTypeLabel =
  (typeof PaymentTypeLabels)[keyof typeof PaymentTypeLabels];

export {
  PaymentTypeEnum,
  PaymentTypes,
  type PaymentTypeType,
  type PaymentTypeLabel,
  PaymentTypeLabels,
};
