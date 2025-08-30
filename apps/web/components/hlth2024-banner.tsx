import Link from "next/link";
import { EventsHlth2024 } from "@/routes";

export function HLTH2024Banner() {
  return (
    <div className="w-full bg-[#252c37] py-3">
      <Link
        href={EventsHlth2024({})}
        className="block text-center text-sm font-medium text-white hover:underline sm:text-base"
      >
        <span aria-hidden="true">🚀 </span>
        {"We'll Be at HLTH 2024 in Las Vegas! Oct 20 - 23 | Book a Meeting Now"}
        <span className="sr-only"> (Click to learn more about HLTH 2024)</span>
      </Link>
    </div>
  );
}
