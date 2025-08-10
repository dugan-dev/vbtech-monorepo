import { z } from "zod";

type AcoPhysAssignMethodType = "palmr qem ranking";

const AcoPhysAssignMethods = ["palmr qem ranking"] as const;

const AcoPhysAssignMethodEnum = z.enum(AcoPhysAssignMethods);

const AcoPhysAssignMethodLabels = {
  "palmr qem ranking": "PALMR QEM Ranking",
};

type AcoPhysAssignMethodLabel =
  (typeof AcoPhysAssignMethodLabels)[keyof typeof AcoPhysAssignMethodLabels];

export {
  AcoPhysAssignMethodEnum,
  AcoPhysAssignMethods,
  type AcoPhysAssignMethodType,
  type AcoPhysAssignMethodLabel,
  AcoPhysAssignMethodLabels,
};
