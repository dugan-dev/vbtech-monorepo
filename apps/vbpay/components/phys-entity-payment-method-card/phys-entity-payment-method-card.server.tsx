import { getNetworkEntity } from "@/repos/network-entity-repository";
import { getNetworkPhysician } from "@/repos/network-physician-repository";
import { getPhysEntityPaymentMethods } from "@/repos/payload-payment-method-repository";

import { getPayloadClientId } from "@/lib/payload";

import { PhysEntityPaymentMethodCardClient } from "./phys-entity-payment-method-card.client";

type props = {
  entityPubId?: string;
  physPubId?: string;
};

/**
 * Renders a payment method card for a network entity or physician by loading their data and associated payment methods.
 *
 * Fetches the network entity or physician (if their public IDs are provided), a payload client token, and payment methods in parallel. Throws an error if any required data fails to load.
 *
 * @param entityPubId - Optional public ID of the network entity whose payment methods are managed.
 * @param physPubId - Optional public ID of the network physician whose payment methods are managed.
 *
 * @throws {Error} If the payload client token cannot be loaded.
 * @throws {Error} If {@link entityPubId} is provided but the network entity cannot be loaded.
 * @throws {Error} If {@link physPubId} is provided but the network physician cannot be loaded.
 */
export async function PhysEntityPaymentMethodCardServer({
  entityPubId,
  physPubId,
}: props) {
  const [entity, physician, payloadClientToken, paymentMethods] =
    await Promise.all([
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

  const payerPubId =
    entityPubId && entity
      ? entity.payerPubId
      : physPubId && physician
        ? physician.payerPubId
        : "";

  return (
    <PhysEntityPaymentMethodCardClient
      payloadClientToken={payloadClientToken}
      paymentMethods={paymentMethods}
      payerPubId={payerPubId}
    />
  );
}
