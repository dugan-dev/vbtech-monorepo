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
