import { z } from "zod/v4";

type LicenseFunctionality =
  | "payment portal"
  | "file sharing"
  | "communication"
  | "payment inquiry"
  | "nppes data recon"
  | "none";

const LicenseFunctionalities = [
  "payment portal",
  "file sharing",
  "communication",
  "payment inquiry",
  "nppes data recon",
  "none",
] as const;

const LicenseFunctionalityEnum = z.enum(LicenseFunctionalities);

const LicenseFunctionalityLabels = {
  "payment portal": "Payment Portal",
  "file sharing": "File Sharing",
  communication: "Communication",
  "payment inquiry": "Payment Inquiry",
  "nppes data recon": "NPPES Data Recon",
  none: "None",
};

type LicenseFunctionalityLabel =
  (typeof LicenseFunctionalityLabels)[keyof typeof LicenseFunctionalityLabels];

export {
  type LicenseFunctionality,
  LicenseFunctionalities,
  LicenseFunctionalityEnum,
  LicenseFunctionalityLabels,
  type LicenseFunctionalityLabel,
};
