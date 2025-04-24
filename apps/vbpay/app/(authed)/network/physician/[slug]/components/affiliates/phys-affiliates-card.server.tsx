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
