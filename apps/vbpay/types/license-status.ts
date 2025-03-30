import { z } from "zod";

type LicenseStatus = "active" | "expired" | "suspended" | "cancelled";
const LicenseStatuses = [
  "active",
  "expired",
  "suspended",
  "cancelled",
] as const;
const LicenseStatusEnum = z.enum(LicenseStatuses);
const LicenseStatusLabels = {
  active: "Active",
  expired: "Expired",
  suspended: "Suspended",
  cancelled: "Cancelled",
};

export {
  type LicenseStatus,
  LicenseStatuses,
  LicenseStatusEnum,
  LicenseStatusLabels,
};
