import Script from "next/script";

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Armare Claim Review",
    description:
      "Medicare payment integrity contractor conducting post-payment reviews of Medicare claims to ensure accuracy and compliance with CMS guidelines.",
    url: "https://www.armareclaimreview.com",
    logo: "https://www.armareclaimreview.com/acr.png",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: "English",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    industry: "Healthcare",
    knowsAbout: [
      "Medicare claim review",
      "Payment integrity",
      "CMS compliance",
      "Healthcare audit",
      "Medical records review",
    ],
    serviceType: "Medicare Payment Integrity Services",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Armare Claim Review",
    url: "https://www.armareclaimreview.com",
    description:
      "Medicare payment integrity contractor conducting post-payment reviews to ensure accuracy and compliance with CMS guidelines.",
    publisher: {
      "@type": "Organization",
      name: "Armare Claim Review",
    },
    inLanguage: "en-US",
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Medicare Claim Review Services",
    description:
      "Post-payment review of Medicare claims to ensure accuracy and compliance with Medicare coverage guidelines and payment policies.",
    provider: {
      "@type": "Organization",
      name: "Armare Claim Review",
    },
    serviceType: "Medicare Payment Integrity",
    areaServed: "United States",
    audience: {
      "@type": "Audience",
      audienceType: "Healthcare Providers",
    },
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
    </>
  );
}
