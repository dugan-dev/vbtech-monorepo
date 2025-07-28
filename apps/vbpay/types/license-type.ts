import { z } from "zod/v4";

type LicenseType = "bpaas" | "saas";
const LicenseTypes = ["bpaas", "saas"] as const;
const LicenseTypeEnum = z.enum(LicenseTypes);
const LicenseTypeLabels = {
  bpaas: "BPaaS",
  saas: "SaaS",
};

export { type LicenseType, LicenseTypes, LicenseTypeEnum, LicenseTypeLabels };
