import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NEXT_RUNTIME: z.enum(["edge", "nodejs"]).optional(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    DB_HOST: z.string(),
    DB_NAME: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_PORT: z.string(),
    AWS_COGNITO_USER_POOL_ID: z.string(),
    AWS_REGION: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_SESSION_TOKEN: z.string(),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  // runtimeEnv: {
  //   DATABASE_URL: process.env.DATABASE_URL,
  //   OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
  // },
  // For Next.js >= 13.4.4, you can just reference process.env:
  experimental__runtimeEnv: process.env,
});
