import { headers } from "next/headers";

export function getClientIp(headerList: Awaited<ReturnType<typeof headers>>) {
  return (
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown"
  );
}
