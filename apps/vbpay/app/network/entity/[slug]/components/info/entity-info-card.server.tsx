import { getNetworkEntity } from "@/repos/network-entity-repository";
import { getUsersData } from "@/repos/user-repository";

import { formatEditEntityFormData } from "../../utils/format-edit-entity-form-data";
import { EntityInfoCardClient } from "./entity-info-card.client";

type props = {
  userId: string;
  entityPubId: string;
};

/**
 * Server component that fetches entity and user data, then renders an entity info card.
 *
 * Retrieves network entity details and user application attributes concurrently. Throws an error if the entity is not found for the given {@link entityPubId}. Passes the formatted entity data, user attributes, and the entity's payer public ID to the client component.
 *
 * @throws {Error} If no entity is found for the provided {@link entityPubId}.
 */
export async function EntityInfoCardServer({ userId, entityPubId }: props) {
  const [entity, user] = await Promise.all([
    getNetworkEntity(entityPubId),
    getUsersData({ userId }),
  ]);

  if (!entity) {
    throw new Error(`No entity found for pubId: ${entityPubId}`);
  }

  const formData = formatEditEntityFormData(entity!);

  return (
    <div className="w-1/4">
      <EntityInfoCardClient
        data={formData}
        usersAppAttrs={user.usersAppAttrs}
        payerPubId={entity.payerPubId}
      />
    </div>
  );
}
