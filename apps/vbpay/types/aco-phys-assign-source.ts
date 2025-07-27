import { z } from "zod/v4";

type AcoPhysAssignSourceType = "cms" | "custom";

const AcoPhysAssignSources = ["cms", "custom"] as const;

const AcoPhysAssignSourceEnum = z.enum(AcoPhysAssignSources);

const AcoPhysAssignSourceLabels = {
  cms: "CMS Source File",
  custom: "Custom File",
};

type AcoPhysAssignSourceLabel =
  (typeof AcoPhysAssignSourceLabels)[keyof typeof AcoPhysAssignSourceLabels];

export {
  AcoPhysAssignSourceEnum,
  AcoPhysAssignSources,
  type AcoPhysAssignSourceType,
  type AcoPhysAssignSourceLabel,
  AcoPhysAssignSourceLabels,
};
