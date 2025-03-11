import { z } from "zod";

export const Route = {
  name: "Beneficiary",
  params: z.object({
    slug: z.string(),
  }),
};
