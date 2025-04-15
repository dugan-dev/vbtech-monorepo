import { UserProvider } from "@/contexts/user-context";
import { getNetworkEntity } from "@/repos/network-entity-repository";
import { getUsersData } from "@/repos/user-repository";

import { formatEditEntityFormData } from "../../utils/format-edit-entity-form-data";
import { EntityInfoCardClient } from "./entity-info-card.client";

type props = {
  userId: string;
  entityPubId: string;
};

/**
 * Server component that fetches entity and user data, then renders an entity info card within a user context.
 *
 * @param userId - The ID of the user whose data is to be fetched.
 * @param entityPubId - The public ID of the entity to display.
 * @returns A React element displaying the entity information card within the appropriate user context.
 *
 * @throws {Error} If no entity is found for the given {@link entityPubId}.
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
      <UserProvider usersAppAttrs={user.usersAppAttrs}>
        <EntityInfoCardClient data={formData} payerPubId={entity.payerPubId} />
      </UserProvider>
    </div>
  );
}
