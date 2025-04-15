import { UserProvider } from "@/contexts/user-context";
import { getNetworkPhysician } from "@/repos/network-physician-repository";
import { getUsersData } from "@/repos/user-repository";

import { formatEditPhysicianFormData } from "../../utils/format-edit-physician-form-data";
import { PhysicianInfoCardClient } from "./physician-info-card.client";

type props = {
  userId: string;
  pubId: string;
};

export async function PhysicianInfoCardServer({ userId, pubId }: props) {
  const [physician, user] = await Promise.all([
    getNetworkPhysician(pubId),
    getUsersData({ userId }),
  ]);

  if (!physician) {
    throw new Error(`No physician found for pubId: ${pubId}`);
  }

  const formData = formatEditPhysicianFormData(physician!);

  return (
    <div className="w-1/4">
      <UserProvider usersAppAttrs={user.usersAppAttrs}>
        <PhysicianInfoCardClient
          data={formData}
          payerPubId={physician.payerPubId}
        />
      </UserProvider>
    </div>
  );
}
