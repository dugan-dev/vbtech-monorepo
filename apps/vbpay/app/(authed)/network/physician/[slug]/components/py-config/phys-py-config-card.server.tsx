import { getNetworkPhysician } from "@/repos/network-physician-repository";

import { getPhysPyConfig } from "../../repos/phys-py-config-repository";
import { formatPhysPyConfigFormData } from "../../utils/format-phys-py-config-form-data";
import { NoPhysConfigView } from "./no-phys-config-view";
import { PhysPyConfigCardClient } from "./phys-py-config-card.client";
import { PhysPyConfigFormData } from "./phys-py-config-form-schema";

type props = {
  physPubId: string;
  perfYearUrl?: string;
};

/**
 * Renders a physician configuration card or a fallback view based on the availability of configuration data.
 *
 * Fetches configuration and network details for the specified physician and performance year. If configuration data is found, displays the configuration card with formatted data; otherwise, shows a fallback view.
 *
 * @param physPubId - The public identifier of the physician.
 * @param perfYearUrl - The performance year to query; defaults to the current year if omitted.
 * @returns A React element displaying either the configuration card or a fallback view.
 * @throws {Error} If no physician is found for the given {@link physPubId}.
 */
export async function PhysPyConfigCardServer({
  physPubId,
  perfYearUrl,
}: props) {
  const perfYear = perfYearUrl ?? new Date().getFullYear().toString();
  const [physPyConfig, phys] = await Promise.all([
    getPhysPyConfig(physPubId, perfYear),
    getNetworkPhysician(physPubId),
  ]);

  if (!phys) {
    throw new Error(`Physician with pubId ${physPubId} not found.`);
  }

  let formData: PhysPyConfigFormData | undefined = undefined;

  if (physPyConfig) {
    formData = formatPhysPyConfigFormData(physPyConfig);
  }

  if (!physPyConfig) {
    return (
      <NoPhysConfigView perfYear={perfYear} payerPubId={phys.payerPubId} />
    );
  }

  return (
    <PhysPyConfigCardClient
      perfYear={perfYear}
      data={formData!}
      payerPubId={phys.payerPubId}
      pubId={physPyConfig?.pubId}
    />
  );
}
