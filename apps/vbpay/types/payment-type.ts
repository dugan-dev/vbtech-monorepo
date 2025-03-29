import { z } from "zod";

type PaymentTypeType = "capitation" | "ffs replacement" | "performance";

const PaymentTypes = ["capitation", "ffs replacement", "performance"] as const;

const PaymentTypeEnum = z.enum(PaymentTypes);

const PaymentTypeLabels = {
  capitation: "Capitation",
  "ffs replacement": "FFS Replacement",
  performance: "Performance",
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
