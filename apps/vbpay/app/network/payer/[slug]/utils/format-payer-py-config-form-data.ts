import { PayerPyConfigFormData } from "../components/py-config/payer-py-config-form-schema";
import { PayerPyConfig } from "../types/payer-py-config";

/**
 * Transforms a PayerPyConfig object into a structured PayerPyConfigFormData format suitable for form handling.
 *
 * The returned object is divided into two sections:
 * - **basicInfo**: Contains essential configuration details such as type, program, performance year (converted to a string), risk option, payment model, and eligibility source.
 * - **physAssignment**: Defines physician assignment details, determining if assignment is required (true when assignToPhysicians equals 1) and including assignment source and method.
 *
 * Default values (empty strings) are provided for fields that may be undefined, ensuring consistency in the returned data.
 *
 * @param payerPyConfig - The configuration data to format.
 * @returns The formatted configuration as a PayerPyConfigFormData object.
 */
export function formatPayerPyConfigFormData(
  payerPyConfig: PayerPyConfig,
): PayerPyConfigFormData {
  return {
    basicInfo: {
      type: payerPyConfig.type ?? "",
      program: payerPyConfig.program ?? "",
      perfYear: payerPyConfig.perfYear.toString(),
      riskOption: payerPyConfig.riskOption ?? "",
      paymentModel: payerPyConfig.paymentModel ?? "",
      eligSource: payerPyConfig.eligSrc,
    },
    physAssignment: {
      isRequired: payerPyConfig.assignToPhysicians === 1 ? true : false,
      physAssignSource: payerPyConfig.physAssignSrc ?? "",
      physAssignMethod: payerPyConfig.physAssignMethod ?? "",
    },
  };
}
