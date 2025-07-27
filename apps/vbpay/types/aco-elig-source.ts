import { z } from "zod/v4";

type AcoEligSourceType = "cms" | "custom";

const AcoEligSources = ["cms", "custom"] as const;

const AcoEligSourceEnum = z.enum(AcoEligSources);

const AcoEligSourceLabels = {
  cms: "CMS Source File",
  custom: "Custom File",
};

type AcoEligSourceLabel =
  (typeof AcoEligSourceLabels)[keyof typeof AcoEligSourceLabels];

export {
  AcoEligSourceEnum,
  AcoEligSources,
  type AcoEligSourceType,
  type AcoEligSourceLabel,
  AcoEligSourceLabels,
};
