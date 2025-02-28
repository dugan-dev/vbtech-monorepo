import { z } from "zod";

export const Route = {
  name: "SigninPage",
  params: z.object({
    signin: z.string().array().optional(),
  }),
};
