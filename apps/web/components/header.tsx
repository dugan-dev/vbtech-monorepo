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

import { ctaButton, mainNavItems } from "@/config/navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-white shadow-md z-50 h-20">
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
            {mainNavItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                {item.children ? (
                  <>
                    <NavigationMenuTrigger className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors duration-200 bg-transparent">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="absolute left-0 bg-white dark:bg-gray-800 shadow-lg rounded-md min-w-[200px] mt-2 transition-all duration-200">
                      <ul className="grid gap-3 p-4 md:w-[300px]">
                        {item.children.map((child) => (
                          <ListItem
                            key={child.href}
                            href={child.href}
                            title={child.title}
                          >
                            {child.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className="text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors duration-200 bg-transparent"
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button asChild>
            <Link href={ctaButton.href}>{ctaButton.title}</Link>
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
          {mainNavItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <Collapsible>
                  <CollapsibleTrigger className="mobile-link flex justify-between">
                    {item.title}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-4 space-y-2 mt-2 border-l border-gray-300 dark:border-gray-700 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  href={item.href}
                  className="block text-lg font-medium text-gray-800 dark:text-gray-200 py-3 hover:text-primary transition-colors duration-200"
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}

          <div className="border-t pt-4">
            <Button asChild className="w-full">
              <Link href={ctaButton.href}>{ctaButton.title}</Link>
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
