import { getNetworkPhysician } from "@/repos/network-physician-repository";

import { formatEditPhysicianFormData } from "../../utils/format-edit-physician-form-data";
import { PhysicianInfoCardClient } from "./physician-info-card.client";

type props = {
  pubId: string;
};

/**
 * Renders a server-side physician information card for the specified public ID.
 *
 * Fetches physician data using the provided {@link pubId}, formats it, and returns a JSX element displaying the physician's information.
 *
 * @param pubId - The public identifier of the physician to display.
 * @returns A JSX element containing the physician information card.
 *
 * @throws {Error} If no physician is found for the given {@link pubId}.
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
