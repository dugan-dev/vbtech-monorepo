import type { SubmissionMethod } from "@/types/submission";

export const SUBMISSION_METHODS: SubmissionMethod[] = [
  {
    title: "Secure Email",
    value: "records@armaresupport.com",
    note: "Encrypted transmission required",
  },
  {
    title: "Secure Fax",
    value: "(858) 351-3291",
    note: "HIPAA compliant transmission",
  },
];

export const MAILING_ADDRESS = {
  company: "Armare Claim Review",
  attention: "Attn: Medical Records Review",
  poBox: "P.O. Box 9419",
  city: "San Diego, CA 92169",
  requirements: ["Case Reference Number", "Provider NPI Number"],
};

export const SUBMISSION_REQUIREMENTS = [
  "Include case reference number on all submissions",
  "Provide complete medical records for dates of service in question",
  "Ensure all pages are legible and properly sequenced",
  "Include provider contact information for follow-up questions",
];
