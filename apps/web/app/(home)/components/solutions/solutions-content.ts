import { ClipboardList, Database } from "lucide-react";

export const SOLUTIONS_CONTENT = {
  title: "Simplifying Payment & Ensuring Compliance",
  description:
    "Purpose-built solutions that simplify payment administration, ensure compliance, and streamline financial operations for health plans and risk-bearing entities.",

  vbPay: {
    logo: "/vbpay-logo-white.png",
    description:
      "A BPaaS platform for ACOs and risk-bearing entities, automating capitation, performance, and FFS replacement payments. VB Pay streamlines reconciliation with built-in compliance, ERA/EOP capabilities, and integrated clearinghouse services—all delivered with white-glove support.",
    tagline: "The only payment platform purpose-built for VBC.",
    flagshipBadge: "Flagship Product",
    link: "/vbpay",
  },

  otherSolutions: [
    {
      icon: Database,
      title: "Backend Payment Processing",
      description:
        "Comprehensive payment infrastructure for payors. We handle clearinghouse services, money transfers, check processing, EOB/EOP generation, and fulfillment—ensuring seamless, compliant, and efficient payment operations.",
    },
    {
      icon: ClipboardList,
      title: "SOX Compliance Tooling",
      description:
        "A secure, audit-ready solution ensuring compliance with SOX controls for payment approvals. Our tool automates documentation, tracks approvals, and provides immutable records—simplifying audits and reducing risk for payors and delegated entities.",
    },
  ],
} as const;
