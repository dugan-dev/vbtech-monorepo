import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="container mt-10 flex flex-wrap justify-between pb-16 pt-10">
      <div className="flex basis-full justify-between gap-8 md:basis-auto md:flex-col md:justify-start">
        <Link href="/">
          <Image
            className=""
            src="/vbtech-logo-horizontal.png"
            alt="vbtech-logo"
            width={350}
            height={200}
          />
        </Link>
      </div>
      {/* <div className="mt-10 flex basis-1/2 flex-col gap-5 md:mt-0 md:basis-auto">
        <h3 className="font-semibold">Product</h3>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Features
        </Link>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Integrations
        </Link>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Pricing
        </Link>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Changelog
        </Link>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Docs
        </Link>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Download
        </Link>
      </div>*/}
      <div className="mt-10 flex basis-1/2 flex-col gap-5 md:mt-0 md:basis-auto">
        <h3 className="font-semibold">Company</h3>
        <Link
          href="/about"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          About us
        </Link>
        {/*
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Blog
        </Link>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Careers
        </Link>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Customers
        </Link>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Brand
        </Link>*/}
      </div>
      <div className="mt-10 flex basis-1/2 flex-col gap-5 md:mt-0 md:basis-auto">
        <h3 className="font-semibold">Resources</h3>
        {/*<Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Startup Program
        </Link>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Community
        </Link>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Contact
        </Link>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          DPA
        </Link>*/}
        <Link
          href="/privacy"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Terms of use
        </Link>
      </div>
      {/*<div className="mt-10 flex basis-1/2 flex-col gap-5 md:mt-0 md:basis-auto">
        <h3 className="font-semibold">Developers</h3>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          API
        </Link>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Status
        </Link>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          GitHub
        </Link>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Docs
        </Link>
      </div>*/}
    </footer>
  );
}
