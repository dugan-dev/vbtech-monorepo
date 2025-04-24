import { PhysPyConfigFormData } from "../components/py-config/phys-py-config-form-schema";
import { PhysPyConfig } from "../types/phys-py-config";

/**
 * Converts a {@link PhysPyConfig} object into a {@link PhysPyConfigFormData} object suitable for form usage.
 *
 * Converts the `perfYear` property to a string and transforms numeric flag properties into boolean values.
 *
 * @param physPyConfig - The configuration object to convert.
 * @returns The formatted configuration data for form consumption.
 */
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
