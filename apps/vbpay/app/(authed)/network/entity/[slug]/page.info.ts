import { z } from "zod";

export const Route = {
  name: "NetworkEntity",
  params: z.object({
    slug: z.string(),
  }),
};
