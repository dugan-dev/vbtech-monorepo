import { Icons } from "@/components/icons";

import { UserFormStep } from "../../../types/user-form-step";

export const UserFormStepValues: UserFormStep[] = [
  { id: 1, title: "Basic Information", icon: Icons.user },
  { id: 2, title: "User Type & Globals", icon: Icons.userCog },
  { id: 3, title: "Entities & Roles", icon: Icons.userPlus },
];
