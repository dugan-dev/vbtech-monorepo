import "server-only";

import {
  CamelCasePlugin,
  HandleEmptyInListsPlugin,
  Kysely,
  replaceWithNoncontingentExpression,
} from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";

import { DB } from "@workspace/db/types";

const dialect = new PlanetScaleDialect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

await using db = new Kysely<DB>({
  dialect,
  plugins: [
    new CamelCasePlugin(),
    new HandleEmptyInListsPlugin({
      strategy: replaceWithNoncontingentExpression,
    }),
  ],
});

export { db };
