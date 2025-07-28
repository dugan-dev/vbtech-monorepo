import { z } from "zod/v4";

export const Route = {
  name: "NetworkPhysician",
  params: z.object({
    slug: z.string(),
  }),
};
