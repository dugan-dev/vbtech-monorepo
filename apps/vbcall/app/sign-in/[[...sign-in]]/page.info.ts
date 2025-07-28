import { z } from "zod/v4";

export const Route = {
  name: "SignIn",
  params: z.object({}),
  query: z.object({ flow: z.string() }),
};
