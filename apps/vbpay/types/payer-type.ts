import { z } from "zod/v4";

type PayerType = "aco" | "mso" | "ma" | "ipa" | "po" | "other";

const PayerTypes = ["aco", "mso", "ma", "ipa", "po", "other"] as const;

const PayerTypeEnum = z.enum(PayerTypes);

const PayerTypeLabels = {
  aco: "ACO",
  mso: "MSO",
  ma: "MA",
  ipa: "IPA",
  po: "Phys Org",
  other: "Other",
};

export { PayerTypeLabels, PayerTypeEnum, PayerTypes, type PayerType };
