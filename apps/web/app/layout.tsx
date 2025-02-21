import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "@workspace/ui/globals.css";

import { Metadata } from "next";
import { LinkedInInsightTag } from "nextjs-linkedin-insight-tag";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.valuebasedtech.com"),
  title: "VB Tech",
  description:
    "Modernizing healthcare operations with cutting-edge technology solutions.",
  keywords: [
    "VB Tech",
    "VBTech",
    "Value Based Tech",
    "Value Based Technologies",
    "VB Pay",
    "VBPay",
    "Healthcare Operations Optimization",
    "Value Based Care",
    "Value-Based Care Solutions",
    "ACO Payment Processing",
    "Capitation Payments",
    "Preadjudicated Claim Payments",
    "Bonus Payments",
    "Incentive Payments",
    "Capitated Payment Models",
    "ACO Reach",
    "ACO REACH Support",
    "MSSP Primary Care Flex",
    "Accountable Care Oragnization (ACO) Payments",
    "Medicare Shared Savings Program (MSSP)",
    "Primary Care Flex",
    "Healthcare Software Development",
    "Innovative Healthcare Technology",
    "Efficiency in Healthcare",
    "Customer-Centric Healthcare Solutions",
    "White-glove business process outsourcing",
    "Healthcare Business Process as a Service (BPaaS)",
    "Healthcare Software as a Service (SaaS)",
    "Adaptive Healthcare Solutions",
    "Modern Healthcare Tools",
    "Physician Payment Systems",
    "Healthcare Workflow Automation",
    "Healthcare Innovation",
    "Purpose-Built Healthcare Tools",
    "Simplified Healthcare Operations",
    "Healthcare Efficiency Enhancement",
    "Healthcare Operations Consulting",
    "ACO Operations",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} flex flex-col flex-1 font-sans antialiased`}
      >
        <Providers>
          <Header />
          {children}
          <Footer />
          <TailwindIndicator />
          <LinkedInInsightTag />
          <SpeedInsights />
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-PKS0RFVC43" />
    </html>
  );
}
