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
 * Retrieves a network entity and user attributes concurrently, formats the entity data, and displays the information using {@link EntityInfoCardClient} wrapped in a {@link UserProvider} context.
 *
 * @param userId - The ID of the user whose data is fetched for context.
 * @param entityPubId - The public ID of the entity to display.
 * @returns A JSX element containing the entity info card within a styled container.
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
      <UserProvider usersAppAttrs={user.usersAppAttrs}>
        <EntityInfoCardClient data={formData} payerPubId={entity.payerPubId} />
      </UserProvider>
    </div>
  );
}
