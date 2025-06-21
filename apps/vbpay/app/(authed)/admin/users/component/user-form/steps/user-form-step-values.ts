import { SteppedFormStep } from "@workspace/ui/types/stepped-form-step";

import { Icons } from "@/components/icons";

export const UserFormStepValues: SteppedFormStep[] = [
  { id: 1, title: "Basic Information", icon: Icons.user },
  { id: 2, title: "User Type & Globals", icon: Icons.userCog },
  { id: 3, title: "Entities & Roles", icon: Icons.userPlus },
];
