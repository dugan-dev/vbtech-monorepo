import { z } from "zod/v4";

export const Route = {
  name: "NetworkEntity",
  params: z.object({
    slug: z.string(),
  }),
};
