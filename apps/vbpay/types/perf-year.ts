import { z } from "zod/v4";

type PerfYear = "2024" | "2025" | "2026";

const PerfYears = ["2024", "2025", "2026"] as const;

const PerfYearEnum = z.enum(PerfYears);

export { type PerfYear, PerfYears, PerfYearEnum };
