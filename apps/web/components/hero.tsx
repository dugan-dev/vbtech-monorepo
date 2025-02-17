import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CalcomButton } from "./calcom-button";

export function Hero() {
  return (
    <section className="container flex flex-col items-center gap-8 pt-12 sm:gap-10">
      <Link href="/about">
        <div className="bg-secondary hover:bg-secondary/60 flex cursor-pointer items-center gap-1 rounded-full border px-4 py-1">
          <span className="text-secondary-foreground text-sm">
            Introducing VB Tech
          </span>
          <ArrowRight size={16} />
        </div>
      </Link>
      <h1 className="font-heading max-w-5xl text-center text-4xl font-semibold sm:text-5xl sm:leading-tight">
        Simplify Payment Operations with
      </h1>
      <Image
        src="/vbpay-logo.png"
        alt="vbpay"
        height={224}
        width={174}
        className="mx-auto p-6"
      />
      <p className="text-muted-foreground max-w-lg text-center text-lg sm:text-xl">
        Purpose-built to simplify and automate value-based payment
        administration for ACOs, IPAs, and other risk-bearing entities.
      </p>
      <div className="grid grid-cols-1 gap-3">
        <CalcomButton />
      </div>
    </section>
  );
}
