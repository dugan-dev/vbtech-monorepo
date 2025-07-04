import { ClipboardList, File } from "lucide-react";

import { SteppedFormStep } from "@/types/stepped-form-step";

export const PayerPyConfigFormSteps: SteppedFormStep[] = [
  { id: 1, title: "Basic Information", icon: File },
  { id: 2, title: "Physician Assignment", icon: ClipboardList },
];
