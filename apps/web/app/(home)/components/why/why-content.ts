import {
  Banknote,
  CheckCircle,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";

export const WHY_CONTENT = {
  title: "Why Choose VB Tech?",
  description:
    "Industry expertise, purpose-built tools, and customized solutions to optimize healthcare operations, reduce costs, and ensure compliance.",
  benefits: [
    {
      icon: Banknote,
      title: "Cost Savings",
      description:
        "Reduce operational expenses by automating workflows, minimizing manual processes, and optimizing resource allocation.",
    },
    {
      icon: ClipboardList,
      title: "Detailed Reporting",
      description:
        "Gain comprehensive insights into financial and operational performance with robust analytics and reporting tools.",
    },
    {
      icon: CheckCircle,
      title: "Improved Efficiency",
      description:
        "Streamline payment and administrative workflows for faster, more accurate processing with reduced errors and delays.",
    },
    {
      icon: ShieldCheck,
      title: "Security & Compliance",
      description:
        "Streamline operational and administrative workflows for faster, more accurate processing with reduced errors and delays.",
    },
  ],
} as const;
