/**
 * Validation result for a procedure code lookup.
 *
 * This type is shared between the server action and client component.
 */
export type ProcedureCodeValidation = {
  /** Whether the code is valid for use */
  isValid: boolean;
  /** Whether the code requires UM evaluation tool */
  requiresUmEval: boolean;
  /** Specific status of the validation */
  status:
    | "auto-approval"
    | "um-eval-required"
    | "not-in-scope"
    | "not-listed"
    | "invalid";
  /** User-facing message describing the validation result */
  message: string;
  /** Optional description of the procedure code */
  description?: string;
  /** Full procedure code data from database if found */
  data?: {
    procCode: string;
    procDesc: string;
    program: string;
    inScope: number;
    hasRules: number;
    ruleSubgroup: string | null;
    ruleSet: string | null;
    ncd: string | null;
    lcd: string | null;
  };
  /** Error message if validation failed due to system error */
  error?: string;
};
