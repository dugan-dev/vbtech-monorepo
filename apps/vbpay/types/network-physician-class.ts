import { z } from "zod";

type NetworkPhysicianClassType = "participant" | "preferred";

const NetworkPhysicianClasses = ["participant", "preferred"] as const;

const NetworkPhysicianClassEnum = z.enum(NetworkPhysicianClasses);

const NetworkPhysicianClassLabels = {
  participant: "Participant",
  preferred: "Preferred",
};

type NetworkPhysicianClassLabel =
  (typeof NetworkPhysicianClassLabels)[keyof typeof NetworkPhysicianClassLabels];

export {
  NetworkPhysicianClassEnum,
  NetworkPhysicianClasses,
  type NetworkPhysicianClassType,
  type NetworkPhysicianClassLabel,
  NetworkPhysicianClassLabels,
};
