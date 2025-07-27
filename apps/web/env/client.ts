import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_LINKEDIN_PARTNER_ID: z.string().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_LINKEDIN_PARTNER_ID:
      process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID,
  },
});
