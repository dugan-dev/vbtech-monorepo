import { z } from "zod";

export const Route = {
  name: "ShareNotificationDetail",
  params: z.object({
    slug: z.string(),
  }),
};
