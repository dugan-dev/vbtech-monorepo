import { FileStack, Landmark, Mailbox, Mails } from "lucide-react";

export const SOLUTIONS_CONTENT = {
  id: "solutions",
  title: "Simplifying Payment & Ensuring Compliance",
  description:
    "Purpose-built solutions that simplify payment administration, ensure compliance, and streamline financial operations for health plans and risk-bearing entities.",

  vbPay: {
    id: "vbpay",
    logo: "/vbpay-logo-white.png",
    description:
      "Automating capitation, FFS replacement, and value-based payments for ACOs and risk-bearing entities. VB Pay streamlines reconciliation with compliance built in, ERA/EOP capabilities, and clearinghouse integration—delivered with white-glove support.",
    tagline: "The only payment platform purpose-built for VBC.",
    flagshipBadge: "Flagship Product",
  },

  otherSolutions: [
    {
      id: "payment",
      icon: Landmark,
      title: "Provider Payment and Remittance",
      description:
        "Streamlined provider payment operations with clearinghouse services, ACH/EFT transfers, check generation, and EOB/EOP fulfillment. Designed for speed, accuracy, and reduced administrative effort.",
    },
    {
      id: "clearing-house",
      icon: FileStack,
      title: "Claim Clearinghouse",
      description:
        "Inbound claim clearinghouse that reduces errors and accelerates processing. From paper claim conversion and attachments to upfront edits, denial letters, and matching, we ensure cleaner claims and faster adjudication.",
    },
    {
      id: "mailroom",
      icon: Mailbox,
      title: "Inbound Mailroom",
      description:
        "Secure, efficient mail handling for healthcare operations. We manage receipt, sorting, stamping, and imaging with workflow automation to ensure compliance and timely processing.",
    },
    {
      id: "fulfillment",
      icon: Mails,
      title: "Outbound Mailroom",
      description:
        "Automated provider communication services, including recovery letters, denial notices, payment explanations, and compliance mailings. We handle printing, fulfillment, and delivery with accuracy and scale.",
    },
  ],
} as const;
