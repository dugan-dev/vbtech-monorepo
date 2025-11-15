import * as z from "zod";

const CaseFormSchema = z.object({
  assignedTo: z.string().min(1, "Required"),
  caseId: z.string().min(1, "Required").max(255),
  clientPubId: z.string().min(1, "Required"),
  planPubId: z.string().min(1, "Required"),
  procedureCode: z.string().min(1, "Required").max(255),
  status: z.string().min(1, "Required"),
  followUpAction: z.string().min(1, "Required"),
  p2pSuccessful: z.string().min(1, "Required"),
  escalatedToMD: z.string().min(1, "Required"),
  mdName: z
    .string()
    .max(255)
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  remarks: z
    .string()
    .max(255)
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
});

type CaseFormData = z.infer<typeof CaseFormSchema>;
type CaseFormInput = z.input<typeof CaseFormSchema>;
type CaseFormOutput = z.output<typeof CaseFormSchema>;

const CaseFormDefaultValues: CaseFormInput = {
  assignedTo: "",
  caseId: "",
  clientPubId: "",
  planPubId: "",
  procedureCode: "",
  status: "Not reviewed",
  followUpAction: "N/A",
  p2pSuccessful: "No",
  escalatedToMD: "No",
  mdName: "",
  remarks: "",
};

export {
  CaseFormDefaultValues,
  CaseFormSchema,
  type CaseFormData,
  type CaseFormInput,
  type CaseFormOutput,
};
