import { PayerPyConfigFormData } from "../components/py-config/payer-py-config-form-schema";
import { PayerPyConfig } from "../types/payer-py-config";

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
