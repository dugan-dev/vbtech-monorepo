"use client";

import Image from "next/image";
import Link from "next/link";
import {
  About,
  Contact,
  Home,
  Privacy,
  ServicesConsulting,
  ServicesTpa,
  SolutionsClaims,
  SolutionsMailroom,
  SolutionsPayments,
  SolutionsVbpay,
  Terms,
} from "@/routes";
import { Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary border-t border-gray-200 py-10 text-secondary">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div>
            <Link href={Home({})}>
              <Image
                src="/vbtech-logo-verticle.png"
                width={200}
                height={100}
                alt="VB Tech Logo"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              Streamlining healthcare operations through expert consulting, TPA
              services, and tech solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:ml-12">
            <h3 className="text-lg font-semibold ">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href={Home({})} className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href={About({})} className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href={Contact({})}
                  className="hover:text-white transition"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href={Privacy({})}
                  className="hover:text-white transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={Terms({})} className="hover:text-white transition">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Services & Solutions */}
          <div>
            <h3 className="text-lg font-semibold ">Services & Solutions</h3>
            <ul className="mt-4 space-y-2  text-sm">
              <li>
                <Link
                  href={ServicesConsulting({})}
                  className="hover:text-white transition"
                >
                  Consulting Services
                </Link>
              </li>
              <li>
                <Link
                  href={ServicesTpa({})}
                  className="hover:text-white transition"
                >
                  TPA Services
                </Link>
              </li>
              <li>
                <Link
                  href={SolutionsVbpay({})}
                  className="hover:text-white transition"
                >
                  VB Pay
                </Link>
              </li>
              <li>
                <Link
                  href={SolutionsPayments({})}
                  className="hover:text-white transition"
                >
                  {`Provider Payment & Remittance`}
                </Link>
              </li>
              <li>
                <Link
                  href={SolutionsClaims({})}
                  className="hover:text-white transition"
                >
                  Claim Clearinghouse
                </Link>
              </li>
              <li>
                <Link
                  href={SolutionsMailroom({})}
                  className="hover:text-white transition"
                >
                  Inbound Mailroom
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between text-sm border-t border-gray-200 pt-6 text-secondary">
          <p>&copy; {new Date().getFullYear()} VB Tech. All rights reserved.</p>

          {/* Social & Contact Icons */}
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="https://www.linkedin.com/company/valuebasedtech"
              target="_blank"
              className="hover:text-white transition"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link
              href="mailto:info@valuebasedtech.com"
              className="hover:text-white transition"
            >
              <Mail className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
