import { UserProvider } from "@/contexts/user-context";
import { getNetworkPhysician } from "@/repos/network-physician-repository";
import { getUsersData } from "@/repos/user-repository";

import { formatEditPhysicianFormData } from "../../utils/format-edit-physician-form-data";
import { PhysicianInfoCardClient } from "./physician-info-card.client";

type props = {
  userId: string;
  pubId: string;
};

/**
 * Server component that fetches and displays physician information for editing.
 *
 * Retrieves physician and user data concurrently, formats the physician data, and renders a client-side physician info card within a user context provider.
 *
 * @param userId - The unique identifier of the user requesting the information.
 * @param pubId - The public identifier of the physician whose information is to be displayed.
 * @returns A JSX element containing the physician info card wrapped in a user context provider.
 *
 * @throws {Error} If no physician is found for the provided {@link pubId}.
 */
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
