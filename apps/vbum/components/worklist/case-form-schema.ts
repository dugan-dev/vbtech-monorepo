import * as z from "zod";

import { formatDate } from "@workspace/utils/format-date";

import { ClosedCaseStatuses, type CaseStatus } from "@/types/case-status";
import { umCase } from "@/types/um-case";

const CaseFormSchema = z
  .object({
    assignedTo: z.string().min(1, "Required"),
    caseId: z.string().min(1, "Required").max(255),
    clientPubId: z.string().min(1, "Required"),
    planPubId: z.string().min(1, "Required"),
    procedureCodes: z.array(
      z.object({
        code: z.string().min(1, "Required").max(255),
      }),
    ),
    caseType: z.string().min(1, "Required"),
    recdDate: z.string().min(1, "Required"),
    status: z.string().min(1, "Required"),
    followUpAction: z.string().min(1, "Required"),
    p2pSuccessful: z.string().min(1, "Required"),
    escalatedToMD: z.string().min(1, "Required"),
    physPubId: z
      .string()
      .optional()
      .transform((value) => (value === "" ? undefined : value)),
    mdRecommended: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
    closedDate: z
      .string()
      .optional()
      .transform((value) => (value === "" ? undefined : value)),
    remarks: z
      .string()
      .max(255)
      .optional()
      .transform((value) => (value === "" ? undefined : value)),
  })
  .refine(
    (data) => {
      // If the status is one of the closed statuses, closedDate is required
      if (ClosedCaseStatuses.includes(data.status as CaseStatus)) {
        return !!data.closedDate && data.closedDate !== "";
      }
      return true;
    },
    {
      message:
        "Closed date is required when status is Approved, Withdrawn, or Denied",
      path: ["closedDate"],
    },
  );

type CaseFormData = z.infer<typeof CaseFormSchema>;
type CaseFormInput = z.input<typeof CaseFormSchema>;
type CaseFormOutput = z.output<typeof CaseFormSchema>;

const CaseFormDefaultValues: CaseFormInput = {
  assignedTo: "",
  caseId: "",
  clientPubId: "",
  planPubId: "",
  procedureCodes: [] as Array<{ code: string }>,
  caseType: "",
  recdDate: "",
  status: "Not Reviewed",
  followUpAction: "N/A",
  p2pSuccessful: "No",
  escalatedToMD: "No",
  physPubId: "",
  mdRecommended: "",
  closedDate: "",
  remarks: "",
};

/**
 * Convert a backend `umCase` record into a `CaseFormInput` object suitable for the form.
 *
 * @param caseData - The source `umCase` record to convert.
 * @returns A `CaseFormInput` where date fields are formatted as strings, `procedureCodes` is an array of `{ code }` objects parsed from a comma-separated string, numeric flags (`mdReview`, `p2pSuccess`) are mapped to `"Yes"`/`"No"`, and missing string fields are replaced with empty strings.
 */
export function umCaseToFormData(caseData: umCase): CaseFormInput {
  const formData: CaseFormInput = {
    assignedTo: caseData.assignedTo || "",
    caseId: caseData.caseNumber,
    caseType: caseData.caseType,
    recdDate: formatDate({ date: caseData.recdDate }),
    closedDate: caseData.closedAt
      ? formatDate({ date: caseData.closedAt })
      : "",
    procedureCodes:
      caseData.procedureCodes?.split(",").map((value) => ({ code: value })) ||
      [],
    clientPubId: caseData.clientPubId,
    planPubId: caseData.planPubId,
    status: caseData.status,
    escalatedToMD: caseData.mdReview === 1 ? "Yes" : "No",
    physPubId: caseData.physPubId || "",
    mdRecommended: caseData.mdRecommended || "",
    followUpAction: caseData.fuAction || "",
    p2pSuccessful: caseData.p2pSuccess === 1 ? "Yes" : "No",
    remarks: caseData.remarks || "",
  };
  return formData;
}

export {
  CaseFormDefaultValues,
  CaseFormSchema,
  type CaseFormData,
  type CaseFormInput,
  type CaseFormOutput,
};