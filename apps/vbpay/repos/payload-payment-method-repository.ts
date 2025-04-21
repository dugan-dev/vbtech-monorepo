import "server-only";

import { cache } from "react";

import { PayloadPaymentMethod } from "@/types/payload-payment-method";
import { PayloadPaymentMethodAttrs } from "@/types/payload-payment-method-attrs";
import { pl } from "@/lib/payload";

/**
 * Retrieves all payment methods with a transfer type of "receive-only".
 *
 * @returns An array of payment methods configured for receive-only transfers.
 *
 * @throws {Error} If fetching payment methods fails.
 */
export async function getAllReceiveOnlyPaymentMethods() {
  try {
    const paymentMethods = await pl
      .select(pl.PaymentMethod)
      // Receive-only payment methods bc these are pay to accounts
      .filterBy({
        transfer_type: "receive-only",
      });

    return JSON.parse(JSON.stringify(paymentMethods)) as PayloadPaymentMethod[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Deletes a payment method by its unique identifier.
 *
 * @param id - The unique identifier of the payment method to delete.
 *
 * @throws {Error} If the deletion fails.
 */
export async function deletePaymentMethod(id: string) {
  try {
    await pl.delete(pl.PaymentMethod({ id }));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getPhysEntityPaymentMethods = cache(
  async (entityPubId: string) => {
    const paymentMethods = await getAllReceiveOnlyPaymentMethods();

    const physEntityPaymentMethods = paymentMethods
      .map((paymentMethod) => {
        return {
          ...paymentMethod,
          pubId: paymentMethod.attrs
            ? (paymentMethod.attrs as PayloadPaymentMethodAttrs).pubId
            : undefined,
        };
      })
      .filter((paymentMethod) => paymentMethod.pubId === entityPubId);

    if (!physEntityPaymentMethods) {
      return [];
    }

    return physEntityPaymentMethods;
  },
);
