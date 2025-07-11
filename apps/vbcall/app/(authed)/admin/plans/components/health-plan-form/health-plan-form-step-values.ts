import { File, IdCard } from "lucide-react";

import { SteppedFormStep } from "@workspace/ui/types/stepped-form-step";

export const HealthPlanFormStepValues: SteppedFormStep[] = [
  { id: 1, title: "Basic Information", icon: File },
  { id: 2, title: "Plan Benefit Packages", icon: IdCard },
];
