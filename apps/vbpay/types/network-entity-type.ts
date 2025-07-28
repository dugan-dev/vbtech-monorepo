import { z } from "zod/v4";

type NetworkEntityType = "prac" | "facl" | "po" | "vendor";

const NetworkEntityTypes = ["prac", "facl", "po", "vendor"] as const;

const NetworkEntityTypeEnum = z.enum(NetworkEntityTypes);

const NetworkEntityTypeLabels = {
  prac: "Practice",
  facl: "Facility",
  po: "Physician Organization",
  vendor: "Vendor",
} as const;

export {
  type NetworkEntityType,
  NetworkEntityTypeLabels,
  NetworkEntityTypes,
  NetworkEntityTypeEnum,
};
