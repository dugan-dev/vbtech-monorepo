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
// Get the payload client id for a given intent
export async function getPayloadClientId(plIntent: PayloadIntentType) {
  const clientToken = await pl.ClientToken.create({
    intent: {
      type: plIntent,
    },
    attrs: "",
  });

  return clientToken.id as string;
}
