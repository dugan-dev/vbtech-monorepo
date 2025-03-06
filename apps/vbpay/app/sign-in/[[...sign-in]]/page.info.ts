import { z } from "zod";

export const Route = {
  name: "SigninPage",
  params: z.object({}),
  query: z.object({ flow: z.string() }),
};
