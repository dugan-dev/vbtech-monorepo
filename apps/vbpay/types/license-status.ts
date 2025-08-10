import { z } from "zod";

type LicenseStatus = "active" | "expired" | "suspended" | "canceled";
const LicenseStatuses = ["active", "expired", "suspended", "canceled"] as const;
const LicenseStatusEnum = z.enum(LicenseStatuses);
const LicenseStatusLabels = {
  active: "Active",
  expired: "Expired",
  suspended: "Suspended",
  canceled: "Canceled",
};

export {
  type LicenseStatus,
  LicenseStatuses,
  LicenseStatusEnum,
  LicenseStatusLabels,
};
