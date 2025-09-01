import { Contact } from "@/routes";

export const CTA_CONTENT = {
  id: "cta",
  title: "Optimize operations, reduce costs, and stay compliant.",
  description:
    "Partner with VB Tech to simplify your healthcare operations. Let’s talk.",
  sectionAriaLabel: "Call to action section",
  button: {
    text: "Get in Touch",
    href: Contact({}),
  },
} as const;
