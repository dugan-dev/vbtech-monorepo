import { getNetworkPhysician } from "@/repos/network-physician-repository";

import { formatEditPhysicianFormData } from "../../utils/format-edit-physician-form-data";
import { PhysicianInfoCardClient } from "./physician-info-card.client";

type props = {
  pubId: string;
};

/**
 * Server component that fetches and displays physician information for a given user and physician ID.
 *
 * Retrieves physician and user data concurrently, formats the physician data, and renders the `PhysicianInfoCardClient` component within a `UserProvider` context.
 *
 * @param userId - The unique identifier of the user.
 * @param pubId - The public identifier of the physician.
 * @returns A JSX element displaying the physician information card.
 *
 * @throws {Error} If no physician is found for the provided {@link pubId}.
 */
export async function PhysicianInfoCardServer({ pubId }: props) {
  const physician = await getNetworkPhysician(pubId);

  if (!physician) {
    throw new Error(`No physician found for pubId: ${pubId}`);
  }

  const formData = formatEditPhysicianFormData(physician!);

  return (
    <PhysicianInfoCardClient
      data={formData}
      payerPubId={physician.payerPubId}
    />
  );
}
