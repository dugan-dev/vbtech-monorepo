import { LicenseProvider } from "@/contexts/license-context";
import { UserProvider } from "@/contexts/user-context";
import { getVBPayLicense } from "@/repos/license-repository";
import { getNetworkPhysician } from "@/repos/network-physician-repository";
import { getUsersData } from "@/repos/user-repository";

import { getPhysPyConfig } from "../../repos/phys-py-config-repository";
import { formatPhysPyConfigFormData } from "../../utils/format-phys-py-config-form-data";
import { NoPhysConfigView } from "./no-phys-config-view";
import { PhysPyConfigCardClient } from "./phys-py-config-card.client";
import { PhysPyConfigFormData } from "./phys-py-config-form-schema";

type props = {
  userId: string;
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
  userId,
  physPubId,
  perfYearUrl,
}: props) {
  const perfYear = perfYearUrl ?? new Date().getFullYear().toString();
  const [physPyConfig, phys, user, license] = await Promise.all([
    getPhysPyConfig(physPubId, perfYear),
    getNetworkPhysician(physPubId),
    getUsersData({ userId }),
    getVBPayLicense(),
  ]);

  if (!phys) {
    throw new Error(`Physician with pubId ${physPubId} not found.`);
  }

  if (!license) {
    throw new Error("Failed to load license.");
  }

  let formData: PhysPyConfigFormData | undefined = undefined;

  if (physPyConfig) {
    formData = formatPhysPyConfigFormData(physPyConfig);
  }

  return (
    <UserProvider usersAppAttrs={user.usersAppAttrs}>
      <LicenseProvider license={license}>
        {physPyConfig ? (
          <PhysPyConfigCardClient
            perfYear={perfYear}
            data={formData!}
            payerPubId={phys.payerPubId}
            pubId={physPyConfig?.pubId}
          />
        ) : (
          <NoPhysConfigView
            userId={userId}
            perfYear={perfYear}
            payerPubId={phys.payerPubId}
          />
        )}
      </LicenseProvider>
    </UserProvider>
  );
}
