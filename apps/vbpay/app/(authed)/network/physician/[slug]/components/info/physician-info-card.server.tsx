import { getNetworkPhysician } from "@/repos/network-physician-repository";

import { formatEditPhysicianFormData } from "../../utils/format-edit-physician-form-data";
import { PhysicianInfoCardClient } from "./physician-info-card.client";

type props = {
  pubId: string;
};

/**
 * Fetches physician data by public ID and renders a physician information card.
 *
 * Retrieves physician details for the given {@link pubId}, formats the data, and renders the `PhysicianInfoCardClient` component.
 *
 * @param pubId - The public identifier of the physician to display.
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
