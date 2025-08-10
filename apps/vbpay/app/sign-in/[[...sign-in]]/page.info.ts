import { z } from "zod";

export const Route = {
  name: "SignIn",
  params: z.object({}),
  query: z.object({ flow: z.string() }),
};
