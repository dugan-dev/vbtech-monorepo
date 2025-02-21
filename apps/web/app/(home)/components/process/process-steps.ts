import { BarChart, RefreshCw, Settings, ShieldCheck } from "lucide-react";

export const PROCESS_STEPS = [
  {
    id: "analyze",
    title: "Analyze",
    description:
      "We assess current workflows, data, and inefficiencies to identify opportunities for optimization and compliance improvements.",
    icon: BarChart,
    iconBgColor: "bg-blue-100",
    iconColor: "text-[#2D6A4F]",
  },
  {
    id: "optimize",
    title: "Optimize",
    description:
      "We implement process enhancements and workflow adjustments to improve efficiency, reduce costs, and streamline operations.",
    icon: Settings,
    iconBgColor: "bg-green-100",
    iconColor: "text-[#F4A261]",
  },
  {
    id: "automate",
    title: "Automate",
    description:
      "We leverage technology to reduce manual work, enhance accuracy, and ensure seamless integration across systems.",
    icon: RefreshCw,
    iconBgColor: "bg-yellow-100",
    iconColor: "text-[#3D5A80]",
  },
  {
    id: "maintain",
    title: "Maintain",
    description:
      "We continuously monitor, refine, and adapt solutions to sustain long-term operational success and regulatory compliance.",
    icon: ShieldCheck,
    iconBgColor: "bg-purple-100",
    iconColor: "text-[#9B2226]",
  },
] as const;
