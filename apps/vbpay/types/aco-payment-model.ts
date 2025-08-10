import { z } from "zod";

type AcoPaymentModelType = "pcc" | "tcc";

const AcoPaymentModels = ["pcc", "tcc"] as const;

const AcoPaymentModelEnum = z.enum(AcoPaymentModels);

const AcoPaymentModelLabels = {
  pcc: "Primary Care Capitation (PCC)",
  tcc: "Total Cost of Care (TCC)",
};

type AcoPaymentModelLabel =
  (typeof AcoPaymentModelLabels)[keyof typeof AcoPaymentModelLabels];

export {
  AcoPaymentModelEnum,
  AcoPaymentModels,
  type AcoPaymentModelType,
  type AcoPaymentModelLabel,
  AcoPaymentModelLabels,
};
