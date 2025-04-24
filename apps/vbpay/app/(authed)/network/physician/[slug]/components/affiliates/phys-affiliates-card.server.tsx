import { getAllNetworkEntities } from "@/repos/network-entity-repository";
import { getNetworkPhysician } from "@/repos/network-physician-repository";
import { getAllPayers } from "@/repos/payer-repository";
import { networkEntitiesToFormCombos } from "@/utils/network-entities-to-form-combos";
import { payersToFormCombos } from "@/utils/payers-to-form-combos";

import { formatEditPhysAffiliatesFormData } from "../../utils/format-edit-phys-affiliates-form-data";
import { PhysAffiliatesCardClient } from "./phys-affiliates-card.client";

type props = {
  pubId: string;
};

/**
 * Server component that fetches and prepares physician affiliate data for editing.
 *
 * Retrieves physician, network entity, and payer data based on the provided {@link pubId}, formats them for the affiliate editing form, and renders the client-side affiliate card component.
 *
 * @param pubId - The public identifier of the physician whose affiliate data is to be displayed and edited.
 *
 * @returns A JSX element rendering the affiliate card client component with preloaded form data and combo options.
 *
 * @throws {Error} If no physician is found for the given {@link pubId}.
 */
export async function PhysAffiliatesCardServer({ pubId }: props) {
  const [physician, entities, payers] = await Promise.all([
    getNetworkPhysician(pubId),
    getAllNetworkEntities(),
    getAllPayers(),
  ]);

  if (!physician) {
    throw new Error(`No physician found for pubId: ${pubId}`);
  }

  const formData = formatEditPhysAffiliatesFormData(physician);

  const { pos, practices, facilities, vendors } = networkEntitiesToFormCombos({
    entities,
  });

  const payersCombo = payersToFormCombos({
    payers,
  });

  return (
    <PhysAffiliatesCardClient
      data={formData}
      payerPubId={physician.payerPubId}
      pos={pos}
      practices={practices}
      facilities={facilities}
      vendors={vendors}
      payers={payersCombo}
    />
  );
}
