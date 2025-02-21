// Automatically generated by declarative-routing, do NOT edit
import { z } from "zod";

import * as HomeRoute from "@/app/page.info";

import { makeRoute } from "./makeRoute";

const defaultInfo = {
  search: z.object({}),
};

export const Home = makeRoute("/", {
  ...defaultInfo,
  ...HomeRoute.Route,
});
