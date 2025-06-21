import { SteppedFormStep } from "@workspace/ui/types/stepped-form-step";

import { Icons } from "@/components/icons";

export const PayerPyConfigFormSteps: SteppedFormStep[] = [
  { id: 1, title: "Basic Information", icon: Icons.file },
  { id: 2, title: "Physician Assignment", icon: Icons.clipboardList },
];
