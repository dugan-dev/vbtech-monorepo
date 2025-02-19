"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Banknote,
  Briefcase,
  CheckCircle,
  ClipboardList,
  CreditCard,
  Database,
  Layers,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-100 to-white py-12 md:py-20 pt-28">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between p-6 text-center md:text-left">
          {/* Left - Hero Text */}
          <div className="md:w-2/3">
            <h1 className="text-5xl font-bold leading-tight w-fit">
              You Focus on Patient Care, <br /> We Focus on Operations.
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Consulting, TPA Services, and Tech Solutions to enabled and
              streamline ACO and health plan operations.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
              <Button asChild>
                <Link href="/services">Learn More</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-end">
            <Image
              src="/people-working-landing-page.png"
              alt="Team collaborating on healthcare solutions"
              width={300} // Increased width for better visual impact
              height={275} // Increased height
              className="rounded-lg shadow-lg" // Added shadow
              priority // Add priority for faster loading of the hero image
            />
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-900">Our Services</h2>
          <p className="mt-2 text-gray-600">
            Expert consulting, managed operations, and automation solutions to
            optimize healthcare payments and operational workflows.
          </p>

          {/* Services Cards */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Consulting Services */}
            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-200">
              <Briefcase className="h-12 w-12 text-primary mb-3" />
              <h3 className="text-xl font-semibold text-gray-900">
                Consulting Services
              </h3>
              <p className="mt-2 text-gray-600 flex-grow">
                Expert guidance for ACO & MA operations, specializing in
                implementations, system conversions, outsourcing, and
                insourcing.
              </p>
              <div className="mt-auto pt-6">
                <Link
                  href="/consulting"
                  className="text-primary hover:underline"
                >
                  Learn More →
                </Link>
              </div>
            </div>

            {/* TPA Services */}
            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-200">
              <Settings className="h-12 w-12 text-primary mb-3" />
              <h3 className="text-xl font-semibold text-gray-900">
                TPA Services
              </h3>
              <p className="mt-2 text-gray-600 flex-grow">
                Full-service administration for health plans & ACOs using
                offshore teams for cost efficiency.
              </p>
              <div className="mt-auto pt-6">
                <Link
                  href="/tpa-services"
                  className="text-primary hover:underline"
                >
                  Learn More →
                </Link>
              </div>
            </div>

            {/* Tech Solutions */}
            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-200">
              <Layers className="h-12 w-12 text-primary mb-3" />
              <h3 className="text-xl font-semibold text-gray-900">
                Tech Solutions
              </h3>
              <p className="mt-2 text-gray-600 flex-grow">
                VB Pay, Backend Payment Processing, and SOX Compliance tools to
                automate and streamline payment operations.
              </p>
              <div className="mt-auto pt-6">
                <Link
                  href="/bpaas-overview"
                  className="text-primary hover:underline"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BPaaS Solutions Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold">Solutions</h2>
          <p className="mt-2">
            Automated solutions for payment processing and financial
            administration.
          </p>

          <div className="mt-10 space-y-8">
            <div className="flex items-start md:items-center flex-col md:flex-row md:space-x-4 text-left md:text-left md:mx-20">
              <CreditCard className="h-12 w-12 text-primary mb-2 md:mb-0" />
              <div>
                <h3 className="text-xl font-semibold ">VB Pay</h3>
                <p className="mt-2 text-secondary-foreground">
                  ACO & VBC payment administration, automating capitation and
                  provider payments.
                </p>
              </div>
            </div>

            <div className="flex items-start md:items-center flex-col md:flex-row md:space-x-4 text-left md:text-left md:mx-20">
              <Database className="h-12 w-12 text-primary mb-2 md:mb-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Backend Payment Processing
                </h3>
                <p className="mt-2 text-gray-600">
                  Clearinghouse services, money transfer, check processing,
                  EOB/EOP fulfillment.
                </p>
              </div>
            </div>

            <div className="flex items-start md:items-center flex-col md:flex-row md:space-x-4 text-left md:text-left md:mx-20">
              <ClipboardList className="h-12 w-12 text-primary mb-2 md:mb-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  SOX Compliance Tool
                </h3>
                <p className="mt-2 text-gray-600">
                  Ensures secure and compliant payment releases across systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose VB Tech */}
      <section className=" py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-900">
            Why Choose VB Tech?
          </h2>
          <p className="mt-2 text-gray-600">
            Industry expertise and purpose-built solutions to optimize
            healthcare payment administration.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 md:mx-20">
            {/* Benefit 1 */}
            <div className="flex items-center space-x-4">
              <Banknote className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cost Savings
                </h3>
                <p className="text-gray-600">
                  Reducing operational costs through automation.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-center space-x-4">
              <ClipboardList className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Detailed Reporting
                </h3>
                <p className="text-gray-600">
                  Comprehensive insights into payment operations.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-center space-x-4">
              <CheckCircle className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Improved Efficiency
                </h3>
                <p className="text-gray-600">
                  Streamlining workflows for faster processing.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex items-center space-x-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Security & Compliance
                </h3>
                <p className="text-gray-600">
                  Ensuring data protection and regulatory compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white">
            Let’s streamline your healthcare operations.
          </h2>
          <p className="mt-4 text-lg text-gray-100">
            Get in touch to see how VB Tech can help reduce operational costs
            and streamline your healthcare operations.
          </p>
          <div className="mt-8">
            <Button variant="secondary" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
