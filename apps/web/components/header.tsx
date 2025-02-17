import Image from "next/image";
import Link from "next/link";

import { CalcomButton } from "./calcom-button";
import { MobileNavbar } from "./mobile-navbar";

export function Header() {
  return (
    <header className="container flex items-center justify-between gap-10 py-4">
      <Link href="/" className="flex items-center gap-3">
        <Image
          className=""
          src="/vbtech-logo-horizontal.png"
          alt="vbtech-logo"
          width={350}
          height={200}
        />
      </Link>
      <div className="flex items-center gap-10">
        <nav className="hidden items-center justify-end gap-10 md:flex">
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center text-lg font-medium transition-colors sm:text-sm"
          >
            About Us
          </Link>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <div className="ml-8 mr-16 flex items-center gap-6">
            <CalcomButton />
          </div>
        </div>
      </div>
      <MobileNavbar>
        <div className="bg-background text-foreground container rounded-b-lg py-4 shadow-xl">
          <nav className="flex flex-col items-center gap-1 pt-2">
            <div>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground flex w-full cursor-pointer items-center rounded-md p-2 font-medium"
              >
                About Us
              </Link>
            </div>
            <div className="ml-8 mr-16 flex items-center justify-center gap-6">
              <CalcomButton />
            </div>
          </nav>
        </div>
      </MobileNavbar>
    </header>
  );
}
