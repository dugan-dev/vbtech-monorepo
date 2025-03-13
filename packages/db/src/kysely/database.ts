import "server-only";

import { CamelCasePlugin, Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";

import { DB } from "@workspace/db/types";

// Create a global reference for the database instance
const globalForDb = globalThis as unknown as { kyselyDb?: Kysely<DB> };

// Ensure we reuse an existing instance or create a new one
export const db =
  globalForDb.kyselyDb ??
  (() => {
    const dialect = new MysqlDialect({
      pool: createPool({
        host: "localhost",
        database: "vbtech",
        user: "root",
        password: "vbtech",
        port: 3306,

        connectionLimit: 15, // 🚀 Allow up to 15 connections
        queueLimit: 25, // ✅ Allow some queuing if all connections are in use
        waitForConnections: true, // ✅ Queue requests instead of throwing errors

        enableKeepAlive: true,
        keepAliveInitialDelay: 0,

        maxIdle: 5, // 🔧 Keep a small number of idle connections
        idleTimeout: 30000, // ⏳ Close idle connections after 30s
      }),
    });

    const instance = new Kysely<DB>({
      dialect,
      plugins: [new CamelCasePlugin()],
    });

    if (process.env.NODE_ENV !== "production") globalForDb.kyselyDb = instance;

    return instance;
  })();
