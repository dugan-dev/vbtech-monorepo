import { z } from "zod";

type CaseType = "Standard" | "Expedited";

const CaseTypes = ["Standard", "Expedited"] as const;

const CaseTypeEnum = z.enum(CaseTypes);

const CaseTypeLabels = {
  Standard: "Standard",
  Expedited: "Expedited",
};

export { CaseTypeEnum, CaseTypes, CaseTypeLabels, type CaseType };
