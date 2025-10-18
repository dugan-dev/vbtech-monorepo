"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button";

export function HLTHBanner() {
  const now = new Date();
  const startDate = new Date("2025-10-17"); // Today
  const endDate = new Date("2025-10-24T23:59:59"); // Next Sunday at end of day

  const isVisible = now >= startDate && now <= endDate;

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-[#6B2FE0] text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Image
              src="/hlth-logo.png"
              alt="HLTH"
              width={80}
              height={32}
              className="h-8 w-auto"
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="font-semibold text-balance">
                We're at HLTH 2025 in Las Vegas!
              </span>
              <span className="text-sm text-white/90">
                Let's connect at the conference
              </span>
            </div>
          </div>
          <Button
            asChild
            className="bg-white hover:bg-white/90 text-[#6B2FE0] font-semibold shrink-0"
          >
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
