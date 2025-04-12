import { getNetworkEntity } from "@/repos/network-entity-repository";
import { getUsersData } from "@/repos/user-repository";

import { formatEditEntityFormData } from "../../utils/format-edit-enity-form-data";
import { EntityInfoCardClient } from "./entity-info-card.client";

type props = {
  userId: string;
  entityPubId: string;
};

/**
 * Renders the server-side entity information card.
 *
 * Concurrently retrieves the network entity and user data using the provided identifiers,
 * formats the entity data for editing, and returns a JSX element that wraps the
 * EntityInfoCardClient component within a styled container.
 *
 * @param userId - The unique identifier for the user.
 * @param entityPubId - The public identifier for the entity.
 */
export async function EntityInfoCardServer({ userId, entityPubId }: props) {
  const [payer, user] = await Promise.all([
    getNetworkEntity(entityPubId),
    getUsersData({ userId }),
  ]);

  const formData = formatEditEntityFormData(payer!);

  return (
    <div className="w-1/4">
      <EntityInfoCardClient
        data={formData}
        usersAppAttrs={user.usersAppAttrs}
      />
    </div>
  );
}
