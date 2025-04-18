import "server-only";

import { env } from "@/env/server";
// @ts-ignore
import payload from "payload-api";

export const pl = payload.Session(env.PAYLOAD_SECRET_KEY);
