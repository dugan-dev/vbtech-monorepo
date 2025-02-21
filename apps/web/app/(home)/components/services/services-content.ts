import { Briefcase, Layers, Settings } from "lucide-react";

export const SERVICES_CONTENT = {
  title: "Our Services",
  description:
    "Expert consulting, managed operations, and automation solutions designed to streamline healthcare operations, enhance efficiency, and drive cost savings across health plans and risk-bearing entities.",
  services: [
    {
      icon: Briefcase,
      title: "Consulting Services",
      description:
        "Strategic consulting for health plans and risk-bearing entities, specializing in operational efficiency, implementations, outsourcing, and insourcing to optimize performance and compliance.",
      href: "/consulting",
    },
    {
      icon: Settings,
      title: "TPA Services",
      description:
        "Comprehensive third-party administration services, leveraging expert teams and proven processes to reduce costs, enhance efficiency, and ensure seamless health plan operations.",
      href: "/tpa-services",
    },
    {
      icon: Layers,
      title: "Tech Solutions",
      description:
        "Purpose-built platforms and automation tools designed to enhance operational efficiency, ensure regulatory adherence, and streamline complex healthcare workflows.",
      href: "/bpaas-overview",
    },
  ],
} as const;
