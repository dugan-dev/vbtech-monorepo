"use client";

import Link from "next/link";
import { Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div>
            <Link href="/">
              <img
                src="/vbtech-logo-horizontal.png"
                alt="VB Tech Logo"
                className="w-48 dark:invert"
              />
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Streamlining healthcare operations through expert consulting, TPA
              services, and tech solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-primary transition"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Services & Solutions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Services & Solutions
            </h3>
            <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400 text-sm">
              <li>
                <Link
                  href="/consulting"
                  className="hover:text-primary transition"
                >
                  Consulting Services
                </Link>
              </li>
              <li>
                <Link
                  href="/tpa-services"
                  className="hover:text-primary transition"
                >
                  TPA Services
                </Link>
              </li>
              <li>
                <Link
                  href="/bpaas/vbpay"
                  className="hover:text-primary transition"
                >
                  VB Pay
                </Link>
              </li>
              <li>
                <Link
                  href="/bpaas/backend-payments"
                  className="hover:text-primary transition"
                >
                  Backend Payment Processing
                </Link>
              </li>
              <li>
                <Link
                  href="/bpaas/sox-compliance"
                  className="hover:text-primary transition"
                >
                  SOX Compliance Tool
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between text-gray-600 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700 pt-6">
          <p>&copy; {new Date().getFullYear()} VB Tech. All rights reserved.</p>

          {/* Social & Contact Icons */}
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="https://www.linkedin.com/company/valuebasedtech"
              target="_blank"
              className="hover:text-primary transition"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link
              href="mailto:info@valuebasedtech.com"
              className="hover:text-primary transition"
            >
              <Mail className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
