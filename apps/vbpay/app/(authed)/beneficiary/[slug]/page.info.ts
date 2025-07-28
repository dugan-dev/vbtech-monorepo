import { z } from "zod/v4";

export const Route = {
  name: "Beneficiary",
  params: z.object({
    slug: z.string(),
  }),
};
