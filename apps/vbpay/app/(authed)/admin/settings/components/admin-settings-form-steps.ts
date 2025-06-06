import { SteppedFormStep } from "@/types/stepped-form-step";
import { Icons } from "@/components/icons";

export const AdminSettingsFormSteps: SteppedFormStep[] = [
  { id: 1, title: "Global Settings", icon: Icons.settings },
];

export const AdminLicenseFormSteps: SteppedFormStep[] = [
  { id: 1, title: "License Information", icon: Icons.idCard },
  { id: 2, title: "License Functionality", icon: Icons.squareFunction },
];
