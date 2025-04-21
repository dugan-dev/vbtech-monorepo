import { PhysPyConfigFormData } from "../components/py-config/phys-py-config-form-schema";
import { PhysPyConfig } from "../types/phys-py-config";

export function formatPhysPyConfigFormData(
  physPyConfig: PhysPyConfig,
): PhysPyConfigFormData {
  return {
    perfYear: physPyConfig.perfYear.toString(),
    enableCapPayments: physPyConfig.enableCapPayments === 1,
    enableClaimPayments: physPyConfig.enableClaimPayments === 1,
    enableValuePayments: physPyConfig.enableValuePayments === 1,
  };
}
