import { z } from "zod";

type AcoProgramType = "aco reach" | "mssp pc flex";

const AcoPrograms = ["aco reach", "mssp pc flex"] as const;

const AcoProgramEnum = z.enum(AcoPrograms);

const AcoProgramLabels = {
  "aco reach": "ACO Reach",
  "mssp pc flex": "MSSP Primary Care Flex",
};

type AcoProgramLabel = (typeof AcoProgramLabels)[keyof typeof AcoProgramLabels];

export {
  AcoProgramEnum,
  AcoPrograms,
  type AcoProgramType,
  type AcoProgramLabel,
  AcoProgramLabels,
};
