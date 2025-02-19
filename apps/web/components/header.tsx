"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@workspace/ui/components/navigation-menu";

const NAV_LINK_STYLE =
  "text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors duration-200 bg-transparent";

const DROPDOWN_MENU_STYLE =
  "absolute left-0 bg-white dark:bg-gray-800 shadow-lg rounded-md min-w-[200px] mt-2 transition-all duration-200";

const MOBILE_LINK_STYLE =
  "block text-lg font-medium text-gray-800 dark:text-gray-200 py-3 hover:text-primary transition-colors duration-200";

const MOBILE_DROPDOWN_STYLE =
  "ml-4 space-y-2 mt-2 border-l border-gray-300 dark:border-gray-700 pl-4";

const MOBILE_DROPDOWN_ITEM_STYLE =
  "block text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-white dark:bg-background shadow-md z-50">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          <Image
            className="h-auto cursor-pointer"
            src="/vbtech-logo-horizontal.png"
            alt="vbtech-logo"
            width={250}
            height={100}
            priority
          />
        </Link>

        {/* Desktop Navigation using ShadCN NavigationMenu */}
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex space-x-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" className={NAV_LINK_STYLE}>
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Services Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={NAV_LINK_STYLE}>
                Services
              </NavigationMenuTrigger>
              <NavigationMenuContent className={DROPDOWN_MENU_STYLE}>
                <ul className="grid gap-3 p-4 md:w-[250px]">
                  <ListItem href="/consulting" title="Consulting">
                    Strategic consulting for ACO & MA operations.
                  </ListItem>
                  <ListItem href="/tpa-services" title="TPA Services">
                    Full-service administration for payers and ACOs.
                  </ListItem>
                  <ListItem href="/bpaas-overview" title="BPaaS Overview">
                    Automated solutions for payment processing.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* BPaaS Solutions Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={NAV_LINK_STYLE}>
                Solutions
              </NavigationMenuTrigger>
              <NavigationMenuContent className={DROPDOWN_MENU_STYLE}>
                <ul className="grid gap-3 p-4 md:w-[300px]">
                  <ListItem href="/bpaas/vbpay" title="VB Pay">
                    Automating capitation and provider payments.
                  </ListItem>
                  <ListItem
                    href="/bpaas/backend-payments"
                    title="Backend Payments"
                  >
                    Clearinghouse services, check processing, EOB/EOP
                    fulfillment.
                  </ListItem>
                  <ListItem
                    href="/bpaas/sox-compliance"
                    title="SOX Compliance Tool"
                  >
                    Secure and compliant payment release automation.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/about" className={NAV_LINK_STYLE}>
                  About
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-background shadow-md p-4 space-y-4">
          <Link href="/" className={MOBILE_LINK_STYLE}>
            Home
          </Link>

          {/* Mobile Collapsible Services Menu */}
          <Collapsible>
            <CollapsibleTrigger className="mobile-link flex justify-between">
              Services
            </CollapsibleTrigger>
            <CollapsibleContent className={MOBILE_DROPDOWN_STYLE}>
              <Link href="/consulting" className={MOBILE_DROPDOWN_ITEM_STYLE}>
                Consulting
              </Link>
              <Link href="/tpa-services" className={MOBILE_DROPDOWN_ITEM_STYLE}>
                TPA Services
              </Link>
              <Link
                href="/bpaas-overview"
                className={MOBILE_DROPDOWN_ITEM_STYLE}
              >
                BPaaS Overview
              </Link>
            </CollapsibleContent>
          </Collapsible>

          {/* Mobile Collapsible BPaaS Solutions Menu */}
          <Collapsible>
            <CollapsibleTrigger className="mobile-link flex justify-between">
              BPaaS Solutions
            </CollapsibleTrigger>
            <CollapsibleContent className={MOBILE_DROPDOWN_STYLE}>
              <Link href="/bpaas/vbpay" className={MOBILE_DROPDOWN_ITEM_STYLE}>
                VB Pay
              </Link>
              <Link
                href="/bpaas/backend-payments"
                className={MOBILE_DROPDOWN_ITEM_STYLE}
              >
                Backend Payments
              </Link>
              <Link
                href="/bpaas/sox-compliance"
                className={MOBILE_DROPDOWN_ITEM_STYLE}
              >
                SOX Compliance Tool
              </Link>
            </CollapsibleContent>
          </Collapsible>

          <Link href="/about" className={MOBILE_LINK_STYLE}>
            About
          </Link>

          <div className="border-t pt-4">
            <Button asChild className="w-full">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

interface ListItemProps {
  title: string;
  href: string;
  children: React.ReactNode;
}

const ListItem = ({ title, href, children }: ListItemProps) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
