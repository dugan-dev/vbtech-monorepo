import { z } from "zod";

export const Route = {
  name: "NetworkPayer",
  params: z.object({
    slug: z.string(),
  }),
};
