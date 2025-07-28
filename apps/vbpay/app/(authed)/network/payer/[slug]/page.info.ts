import { z } from "zod/v4";

export const Route = {
  name: "NetworkPayer",
  params: z.object({
    slug: z.string(),
  }),
};
