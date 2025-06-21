import { SteppedFormStep } from "@workspace/ui/types/stepped-form-step";

import { Icons } from "@/components/icons";

export const SetupFormSteps: SteppedFormStep[] = [
  { id: 1, title: "License Information", icon: Icons.idCard },
  { id: 2, title: "License Functionality", icon: Icons.squareFunction },
  { id: 3, title: "Global Settings", icon: Icons.settings },
];
