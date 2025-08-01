import { User, UserCog, UserPlus } from "lucide-react";

import { SteppedFormStep } from "@workspace/ui/types/stepped-form-step";

export const UserFormStepValues: SteppedFormStep[] = [
  { id: 1, title: "Basic Information", icon: User },
  { id: 2, title: "User Type & Globals", icon: UserCog },
  { id: 3, title: "Entities & Roles", icon: UserPlus },
];
