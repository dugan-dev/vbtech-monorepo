import { z } from "zod";

type NetworkPhysicianType =
  | "individual participant"
  | "fqhc individual"
  | "organizational provider";

const NetworkPhysicianTypes = [
  "individual participant",
  "fqhc individual",
  "organizational provider",
] as const;

const NetworkPhysicianTypeEnum = z.enum(NetworkPhysicianTypes);

const NetworkPhysicianTypeLabels = {
  "individual participant": "Individual Participant",
  "fqhc individual": "FQHC Individual",
  "organizational provider": "Organizational Provider",
};

type NetworkPhysicianTypeLabel =
  (typeof NetworkPhysicianTypeLabels)[keyof typeof NetworkPhysicianTypeLabels];

export {
  NetworkPhysicianTypeEnum,
  NetworkPhysicianTypes,
  type NetworkPhysicianType,
  type NetworkPhysicianTypeLabel,
  NetworkPhysicianTypeLabels,
};
