import { z } from "zod/v4";

export const Route = {
  name: "ShareNotificationDetail",
  params: z.object({
    slug: z.string(),
  }),
};
