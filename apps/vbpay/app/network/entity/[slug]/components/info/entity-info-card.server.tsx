import { getNetworkEntity } from "@/repos/network-entity-repository";
import { getUsersData } from "@/repos/user-repository";

import { formatEditEntityFormData } from "../../utils/format-edit-enity-form-data";
import { EntityInfoCardClient } from "./entity-info-card.client";

type props = {
  userId: string;
  entityPubId: string;
};

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
