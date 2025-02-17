import type { NextConfig } from "next";

// Validate env during build
import "./env/server.ts";
import "./env/client.ts";

const nextConfig: NextConfig = {
  output: undefined, // use default output bc we are hosting on vercel
  experimental: {
    reactCompiler: true,
    authInterrupts: true,
  },
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
};

export default nextConfig;
