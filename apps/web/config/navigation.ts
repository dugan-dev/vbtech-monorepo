import {
  About,
  Contact,
  Home,
  Services,
  ServicesConsulting,
  ServicesTpa,
  Solutions,
  SolutionsClaims,
  SolutionsMailroom,
  SolutionsPayments,
  SolutionsVbpay,
} from "@/routes";

export type NavItem = {
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
  },
  {
    title: "Services",
    href: Services({}),
    children: [
      {
        title: "Consulting",
        href: ServicesConsulting({}),
        description: "Strategic consulting for ACO & MA operations.",
      },
      {
        title: "TPA",
        href: ServicesTpa({}),
        description:
          "Full-service administration using existing platforms and tooling.",
      },
    ],
  },
  {
    title: "Solutions",
    href: Solutions({}),
    children: [
      {
        title: "VB Pay",
        href: SolutionsVbpay({}),
        description:
          "Automating capitation, FFS replacement and value-based payments.",
      },
      {
        title: "Provider Payment and Remittance",
        href: SolutionsPayments({}),
        description:
          "Clearinghouse services, ACH/EFT, check generation, EOB/EOP fulfillment.",
      },
      {
        title: "Claim Clearinghouse",
        href: SolutionsClaims({}),
        description:
          "Inbound claim clearinghouse, paper claim conversion, claim attachments, upfront edits, denial letter fulfillment, member and provider matching.",
      },
      {
        title: "Inbound Mailroom",
        href: SolutionsMailroom({}),
        description:
          "Mail receipt, sorting, stamping, imaging and document workflow management.",
      },
    ],
  },
  {
    title: "About",
    href: About({}),
  },
];

export const ctaButton = {
  title: "Get in Touch",
  href: Contact({}),
};
