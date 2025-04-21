import { UserProvider } from "@/contexts/user-context";
import { getNetworkEntity } from "@/repos/network-entity-repository";
import { getNetworkPhysician } from "@/repos/network-physician-repository";
import { getPhysEntityPaymentMethods } from "@/repos/payload-payment-method-repository";
import { getUsersData } from "@/repos/user-repository";

import { getPayloadClientId } from "@/lib/payload";

import { PhysEntityPaymentMethodCardClient } from "./phys-entity-payment-method-card.client";

type props = {
  userId: string;
  entityPubId?: string;
  physPubId?: string;
};

/**
 * Server component that loads user, entity or physician, and payment method data to render a payment method card.
 *
 * Fetches user attributes, network entity or physician details (if IDs are provided), a payload client token, and associated payment methods in parallel. Throws an error if required data fails to load. Renders the payment method card client component within a user context.
 *
 * @param userId - The user ID whose data is loaded for context.
 * @param entityPubId - Optional public ID of the network entity whose payment methods are managed.
 * @param physPubId - Optional public ID of the network physician whose payment methods are managed.
 *
 * @throws {Error} If the payload client token cannot be loaded.
 * @throws {Error} If {@link entityPubId} is provided but the network entity cannot be loaded.
 * @throws {Error} If {@link physPubId} is provided but the network physician cannot be loaded.
 */
export async function PhysEntityPaymentMethodCardServer({
  userId,
  entityPubId,
  physPubId,
}: props) {
  const [user, entity, physician, payloadClientToken, paymentMethods] =
    await Promise.all([
      getUsersData({ userId }),
      entityPubId ? getNetworkEntity(entityPubId) : null,
      physPubId ? getNetworkPhysician(physPubId) : null,
      getPayloadClientId("payment_method_form"),
      getPhysEntityPaymentMethods(entityPubId ?? physPubId ?? ""),
    ]);

  if (!payloadClientToken) {
    throw new Error("Failed to load payload client token.");
  }

  if (entityPubId && !entity) {
    throw new Error("Failed to load network entity.");
  }

  if (physPubId && !physician) {
    throw new Error("Failed to load network physician.");
  }

  const payerPubId = entityPubId
    ? entity!.payerPubId
    : physPubId
      ? physician!.payerPubId
      : "";

  return (
    <UserProvider usersAppAttrs={user.usersAppAttrs}>
      <PhysEntityPaymentMethodCardClient
        payloadClientToken={payloadClientToken}
        paymentMethods={paymentMethods}
        payerPubId={payerPubId}
      />
    </UserProvider>
  );
}
