import { SteppedFormStep } from "@workspace/ui/types/stepped-form-step";

import { Icons } from "@/components/icons";

export const HealthPlanFormStepValues: SteppedFormStep[] = [
  { id: 1, title: "Basic Information", icon: Icons.file },
  { id: 2, title: "Plan Benefit Packages", icon: Icons.idCard },
];
