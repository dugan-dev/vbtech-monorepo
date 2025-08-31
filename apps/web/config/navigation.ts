import { About, Contact, Home } from "@/routes";

export type NavItem = {
  id: string;
  title: string;
  href: string;
  description?: string;
  children?: NavItem[];
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const mainNavItems: NavItem[] = [
  {
    title: "Home",
    href: Home({}),
    id: "home",
  },
  {
    id: "services",
    title: "Services",
    href: "/#services",
    children: [
      {
        id: "services-1",
        title: "Consulting",
        href: "/#services",
        description: "Strategic consulting for ACO & MA operations.",
      },
      {
        id: "services-2",
        title: "TPA",
        href: "/#services",
        description:
          "Full-service administration using existing platforms and tooling.",
      },
    ],
  },
  {
    id: "solutions",
    title: "Solutions",
    href: "/#solutions",
    children: [
      {
        id: "vbpay",
        title: "VB Pay",
        href: "/#solutions",
        description:
          "Automating capitation, FFS replacement and value-based payments.",
      },
      {
        id: "payment",
        title: "Provider Payment and Remittance",
        href: "/#solutions",
        description:
          "Clearinghouse services, ACH/EFT, check generation, EOB/EOP fulfillment.",
      },
      {
        id: "clearing-house",
        title: "Claim Clearinghouse",
        href: "/#solutions",
        description:
          "Inbound claim clearinghouse, paper claim conversion, claim attachments, upfront edits, denial letter fulfillment, member and provider matching.",
      },
      {
        id: "mailroom",
        title: "Inbound Mailroom",
        href: "/#solutions",
        description:
          "Mail receipt, sorting, stamping, imaging and document workflow management.",
      },
      {
        id: "fulfillment",
        title: "Outbound Mailroom",
        href: "/#solutions",
        description:
          "Automated printing, fulfillment, and delivery of recovery letters, denial notices, and compliance mailings.",
      },
    ],
  },
  {
    id: "about",
    title: "About",
    href: About({}),
  },
];

export const ctaButton = {
  title: "Get in Touch",
  href: Contact({}),
};
