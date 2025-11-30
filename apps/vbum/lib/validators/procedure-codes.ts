// Mock database of procedure codes with contract and UM eval requirements
const PROCEDURE_CODE_DATABASE = {
  // Codes we handle - no UM eval required
  "99213": {
    valid: true,
    requiresUmEval: false,
    description: "Office visit, established patient",
  },
  "99214": {
    valid: true,
    requiresUmEval: true,
    description: "Office visit, established patient",
  },
  "99215": {
    valid: true,
    requiresUmEval: false,
    description: "Office visit, established patient",
  },
  "99203": {
    valid: true,
    requiresUmEval: false,
    description: "Office visit, new patient",
  },
  "99204": {
    valid: true,
    requiresUmEval: false,
    description: "Office visit, new patient",
  },

  // Codes we handle - UM eval required
  "27447": {
    valid: true,
    requiresUmEval: true,
    description: "Total knee arthroplasty",
  },
  "27130": {
    valid: true,
    requiresUmEval: true,
    description: "Total hip arthroplasty",
  },
  "43644": {
    valid: true,
    requiresUmEval: true,
    description: "Laparoscopic gastric bypass",
  },
  "63030": {
    valid: true,
    requiresUmEval: true,
    description: "Lumbar laminectomy",
  },
  "33533": {
    valid: true,
    requiresUmEval: true,
    description: "Coronary artery bypass",
  },
  "47562": {
    valid: true,
    requiresUmEval: true,
    description: "Laparoscopic cholecystectomy",
  },
  "19307": { valid: true, requiresUmEval: true, description: "Mastectomy" },
  "58150": {
    valid: true,
    requiresUmEval: true,
    description: "Total abdominal hysterectomy",
  },

  // Invalid codes (not in our contract)
  "00000": { valid: false, requiresUmEval: false, description: "Invalid code" },
  "99999": { valid: false, requiresUmEval: false, description: "Invalid code" },
};

export interface ProcedureCodeValidation {
  isValid: boolean;
  requiresUmEval: boolean;
  description?: string;
  error?: string;
}

/**
 * Validate a procedure code against the in-file contract database.
 *
 * @param code - Procedure code; leading/trailing whitespace is ignored and letters are treated case-insensitively
 * @returns A `ProcedureCodeValidation` describing whether the code is covered by the contract. If `isValid` is `true`, `requiresUmEval` and `description` are populated; if `isValid` is `false`, `error` contains a human-readable reason.
 */
export async function validateProcedureCode(
  code: string,
): Promise<ProcedureCodeValidation> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Normalize the code (remove spaces, uppercase)
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return {
      isValid: false,
      requiresUmEval: false,
      error: "Procedure code is required",
    };
  }

  // Check if code exists in our database
  const codeInfo =
    PROCEDURE_CODE_DATABASE[
      normalizedCode as keyof typeof PROCEDURE_CODE_DATABASE
    ];

  if (!codeInfo) {
    return {
      isValid: false,
      requiresUmEval: false,
      error: "Code not found in contract",
    };
  }

  if (!codeInfo.valid) {
    return {
      isValid: false,
      requiresUmEval: false,
      error: "Code not covered by contract",
    };
  }

  return {
    isValid: true,
    requiresUmEval: codeInfo.requiresUmEval,
    description: codeInfo.description,
  };
}