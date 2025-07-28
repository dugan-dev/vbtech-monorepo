import { z } from "zod/v4";

type AcoTypeType = "standard" | "new entrant" | "high needs";

const AcoTypes = ["standard", "new entrant", "high needs"] as const;

const AcoTypeEnum = z.enum(AcoTypes);

const AcoTypeLabels = {
  standard: "Standard",
  "new entrant": "New Entrant",
  "high needs": "High Needs",
};

type AcoTypeLabel = (typeof AcoTypeLabels)[keyof typeof AcoTypeLabels];

export {
  AcoTypeEnum,
  AcoTypes,
  type AcoTypeType,
  type AcoTypeLabel,
  AcoTypeLabels,
};
