import { SteppedFormStep } from "@/types/stepped-form-step";
import { Icons } from "@/components/icons";

export const SetupFormStepValues: SteppedFormStep[] = [
  { id: 1, title: "License Information", icon: Icons.user },
  { id: 2, title: "License Functionality", icon: Icons.userCog },
  { id: 3, title: "Global Settings", icon: Icons.userPlus },
];
