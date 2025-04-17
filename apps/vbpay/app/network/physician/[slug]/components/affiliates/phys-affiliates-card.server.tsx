import { UserProvider } from "@/contexts/user-context";
import { getAllNetworkEntities } from "@/repos/network-entity-repository";
import { getNetworkPhysician } from "@/repos/network-physician-repository";
import { getAllPayers } from "@/repos/payer-repository";
import { getUsersData } from "@/repos/user-repository";
import { networkEntitiesToFormCombos } from "@/utils/network-entities-to-form-combos";
import { payersToFormCombos } from "@/utils/payers-to-form-combos";

import { formatEditPhysAffiliatesFormData } from "../../utils/format-edit-phys-affiliates-form-data";
import { PhysAffiliatesCardClient } from "./phys-affiliates-card.client";

type props = {
  userId: string;
  pubId: string;
};

export async function PhysAffiliatesCardServer({ userId, pubId }: props) {
  const [physician, user, entities, payers] = await Promise.all([
    getNetworkPhysician(pubId),
    getUsersData({ userId }),
    getAllNetworkEntities(),
    getAllPayers(),
  ]);

  if (!physician) {
    throw new Error(`No physician found for pubId: ${pubId}`);
  }

  const formData = formatEditPhysAffiliatesFormData(physician!);

  const { pos, practices, facilities, vendors } = networkEntitiesToFormCombos({
    entities,
  });

  const payersCombo = payersToFormCombos({
    payers,
  });

  return (
    <UserProvider usersAppAttrs={user.usersAppAttrs}>
      <PhysAffiliatesCardClient
        data={formData}
        payerPubId={physician.payerPubId}
        pos={pos}
        practices={practices}
        facilities={facilities}
        vendors={vendors}
        payers={payersCombo}
      />
    </UserProvider>
  );
}
