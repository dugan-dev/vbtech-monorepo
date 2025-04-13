import "server-only";

import { CamelCasePlugin, Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";

import { DB } from "@workspace/db/types";

const dialect = new MysqlDialect({
  pool: createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT!),

    connectionLimit: 15, // 🚀 Allow up to 15 connections
    queueLimit: 25, // ✅ Allow some queuing if all connections are in use
    waitForConnections: true, // ✅ Queue requests instead of throwing errors

    enableKeepAlive: true,
    keepAliveInitialDelay: 0,

    maxIdle: 5, // 🔧 Keep a small number of idle connections
    idleTimeout: 30000, // ⏳ Close idle connections after 30s
  }),
});

await using db = new Kysely<DB>({
  dialect,
  plugins: [new CamelCasePlugin()],
});

export { db };
