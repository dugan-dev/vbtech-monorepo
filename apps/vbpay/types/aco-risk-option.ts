import { z } from "zod/v4";

type AcoRiskOptionType = "global" | "professional";

const AcoRiskOptions = ["global", "professional"] as const;

const AcoRiskOptionEnum = z.enum(AcoRiskOptions);

const AcoRiskOptionLabels = {
  global: "Global",
  professional: "Professional",
};

type AcoRiskOptionLabel =
  (typeof AcoRiskOptionLabels)[keyof typeof AcoRiskOptionLabels];

export {
  AcoRiskOptionEnum,
  AcoRiskOptions,
  type AcoRiskOptionType,
  type AcoRiskOptionLabel,
  AcoRiskOptionLabels,
};
