import type { OrganizationInfo } from "@/types/organization";

export const ORGANIZATION_INFO: OrganizationInfo = {
  name: "Armare Claim Review",
  description: [
    "Armare Claim Review is a Medicare payment integrity contractor working on behalf of Medicare Advantage organizations to review claims and identify potential overpayments in accordance with CMS regulations.",
    "We conduct post-payment reviews of Medicare claims to ensure accuracy and compliance with Medicare coverage guidelines and payment policies.",
  ],
  keyInfo: {
    organizationType: "Payment Integrity Contractor",
    primaryFunction: "Medicare Claim Review",
    regulatoryAuthority: "CMS Guidelines",
    reviewType: "Post-Payment Audit",
  },
  badges: ["CMS Compliant", "HIPAA Compliant"],
};
