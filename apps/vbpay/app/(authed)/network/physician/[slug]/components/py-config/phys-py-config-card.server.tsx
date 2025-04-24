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
 * Server component that fetches and prepares physician configuration data for display.
 *
 * Retrieves physician configuration, physician details, user data, and license information in parallel. Renders a configuration card if data exists, or a fallback view if not, wrapped in user and license context providers.
 *
 * @param userId - The user identifier.
 * @param physPubId - The physician's public identifier.
 * @param perfYearUrl - Optional performance year; defaults to the current year if not provided.
 *
 * @returns A React element displaying the physician configuration card or a fallback view.
 *
 * @throws {Error} If the physician or license data cannot be found.
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
