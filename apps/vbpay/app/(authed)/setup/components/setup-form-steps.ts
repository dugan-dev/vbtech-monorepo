import { IdCard, Settings, SquareFunction } from "lucide-react";

import { SteppedFormStep } from "@workspace/ui/types/stepped-form-step";

export const SetupFormSteps: SteppedFormStep[] = [
  { id: 1, title: "License Information", icon: IdCard },
  { id: 2, title: "License Functionality", icon: SquareFunction },
  { id: 3, title: "Global Settings", icon: Settings },
];
