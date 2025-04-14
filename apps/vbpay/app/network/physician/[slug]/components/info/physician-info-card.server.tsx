import { getNetworkPhysician } from "@/repos/network-physician-repository";
import { getUsersData } from "@/repos/user-repository";

import { formatEditPhysicianFormData } from "../../utils/format-edit-physician-form-data";
import { PhysicianInfoCardClient } from "./physician-info-card.client";

type props = {
  userId: string;
  pubId: string;
};

/**
 * Server component that fetches and displays physician and user information in a formatted info card.
 *
 * Fetches physician data by {@link pubId} and user data by {@link userId} concurrently. Throws an error if no physician is found for the given {@link pubId}. Renders a client-side info card with the formatted physician data, user application attributes, and the physician's payer public ID.
 *
 * @param userId - The user ID for fetching user data.
 * @param pubId - The public ID for fetching physician data.
 * @returns A JSX element containing the physician info card.
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
      <PhysicianInfoCardClient
        data={formData}
        usersAppAttrs={user.usersAppAttrs}
        payerPubId={physician.payerPubId}
      />
    </div>
  );
}
