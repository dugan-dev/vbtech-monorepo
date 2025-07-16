import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Armare Claim Review - Medicare Payment Integrity Contractor",
    template: "%s | Armare Claim Review",
  },
  description:
    "Armare Claim Review is a Medicare payment integrity contractor conducting post-payment reviews of Medicare claims to ensure accuracy and compliance with CMS guidelines and Medicare coverage policies.",
  keywords: [
    "Medicare claim review",
    "payment integrity contractor",
    "CMS compliance",
    "Medicare audit",
    "post-payment review",
    "healthcare compliance",
    "Medicare overpayment",
    "claim recoupment",
    "medical records review",
    "appeals process",
  ],
  authors: [{ name: "Armare Claim Review" }],
  creator: "Armare Claim Review",
  publisher: "Armare Claim Review",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.armareclaimreview.com",
    siteName: "Armare Claim Review",
    title: "Armare Claim Review - Medicare Payment Integrity Contractor",
    description:
      "Medicare payment integrity contractor conducting post-payment reviews to ensure accuracy and compliance with CMS guidelines.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Armare Claim Review - Medicare Payment Integrity Contractor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Armare Claim Review - Medicare Payment Integrity Contractor",
    description:
      "Medicare payment integrity contractor conducting post-payment reviews to ensure accuracy and compliance with CMS guidelines.",
    images: ["/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.armareclaimreview.com",
  },
  category: "Healthcare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
