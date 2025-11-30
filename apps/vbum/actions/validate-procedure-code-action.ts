"use server";

import "server-only";

import { getActiveProcedureCodeByCode } from "@/repos/procedure-code-repository";
import { z } from "zod";

import { UserType } from "@/types/user-type";
import { readOnlyActionClient } from "@/lib/safe-action";
import type { ProcedureCodeValidation } from "@/lib/validators/procedure-codes";

const schema = z.object({
  code: z.string().min(1, "Procedure code is required"),
});

const ALLOWED_USER_TYPES: UserType[] = ["nurse", "ops"];

/**
 * Server action to validate a procedure code against the database.
 *
 * Validation logic:
 * 1. Code not found in DB → "not-listed" - use MCG, NCDs and LCDs
 * 2. Code found + hasRules = 1 → "um-eval-required" - requires UM evaluation
 * 3. Code found + hasRules = 0 + inScope = 1 → "auto-approval" - no UM review needed
 * 4. Code found + inScope = 0 → "not-in-scope" - code not in scope
 */
export const validateProcedureCodeAction = readOnlyActionClient
  .metadata({
    actionName: "validateProcedureCodeAction",
    allowedTypes: ALLOWED_USER_TYPES,
  })
  .inputSchema(schema)
  .action(
    async ({ parsedInput: { code } }): Promise<ProcedureCodeValidation> => {
      const trimmedCode = code.trim().toUpperCase();

      // Query the database
      const procedureCode = await getActiveProcedureCodeByCode(trimmedCode);

      // Case 1: Code not found in database
      if (!procedureCode) {
        return {
          isValid: false,
          requiresUmEval: false,
          status: "not-listed",
          message: "Not listed - use MCG, NCDs and LCDs",
        };
      }

      // Case 2: Code has rules - requires UM evaluation
      if (procedureCode.hasRules === 1) {
        return {
          isValid: true,
          requiresUmEval: true,
          status: "um-eval-required",
          message: "UM evaluation required",
          description: procedureCode.procDesc,
          data: {
            procCode: procedureCode.procCode,
            procDesc: procedureCode.procDesc,
            program: procedureCode.program,
            inScope: procedureCode.inScope,
            hasRules: procedureCode.hasRules,
            ruleSubgroup: procedureCode.ruleSubgroup,
            ruleSet: procedureCode.ruleSet,
            ncd: procedureCode.ncd,
            lcd: procedureCode.lcd,
          },
        };
      }

      // Case 3: Code has no rules but is in scope - auto approval
      if (procedureCode.inScope === 1) {
        return {
          isValid: true,
          requiresUmEval: false,
          status: "auto-approval",
          message: "Auto-approved - no UM review required",
          description: procedureCode.procDesc,
          data: {
            procCode: procedureCode.procCode,
            procDesc: procedureCode.procDesc,
            program: procedureCode.program,
            inScope: procedureCode.inScope,
            hasRules: procedureCode.hasRules,
            ruleSubgroup: procedureCode.ruleSubgroup,
            ruleSet: procedureCode.ruleSet,
            ncd: procedureCode.ncd,
            lcd: procedureCode.lcd,
          },
        };
      }

      // Case 4: Code is not in scope
      return {
        isValid: false,
        requiresUmEval: false,
        status: "not-in-scope",
        message: "Code not in scope",
        description: procedureCode.procDesc,
        data: {
          procCode: procedureCode.procCode,
          procDesc: procedureCode.procDesc,
          program: procedureCode.program,
          inScope: procedureCode.inScope,
          hasRules: procedureCode.hasRules,
          ruleSubgroup: procedureCode.ruleSubgroup,
          ruleSet: procedureCode.ruleSet,
          ncd: procedureCode.ncd,
          lcd: procedureCode.lcd,
        },
      };
    },
  );
