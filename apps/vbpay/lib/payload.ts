import "server-only";

import { env } from "@/env/server";
// @ts-expect-error Missing types
import payload from "payload-api";

import { PayloadIntentType } from "@/types/payload-intent";

export const pl = payload.Session(env.PAYLOAD_SECRET_KEY);

/**
 * Creates and returns a payload client token ID for a specific intent type.
 *
 * @param plIntent - The type of payload intent for which to create a client token
 * @returns A promise resolving to the generated client token ID string
 */
/**
 * Creates a payload client token for the specified intent type and returns its ID.
 *
 * @param plIntent - The intent type for which to generate the client token.
 * @returns The ID of the created client token.
 */
export async function getPayloadClientId(plIntent: PayloadIntentType) {
  try {
    const clientToken = await pl.ClientToken.create({
      intent: {
        type: plIntent,
      },
    });

    if (!clientToken || !clientToken.id) {
      throw new Error("Payload client token ID not found");
    }

    return clientToken.id as string;
  } catch (error) {
    console.error(
      `Failed to created client token for intent: ${plIntent}`,
      error,
    );
    throw new Error(
      `Failed to create Payload client token: ${error instanceof Error ? error.message : error}`,
    );
  }
}
