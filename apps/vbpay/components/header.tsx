"use client";

import { Fragment } from "react";
import { useParams, usePathname } from "next/navigation";
import { getPageTitle } from "@/utils/get-page-title";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";

import { BreadcrumbItemType } from "@/types/breadcrumb-item";
import { PayerSelectionData } from "@/types/payer-selection-data";
import { SignOutButton } from "@/components/signout-button";

type props = {
  breadcrumbs?: BreadcrumbItemType[];
  overrideTitle?: string;
  payerSelectionData?: PayerSelectionData;
};

export function Header({
  breadcrumbs,
  overrideTitle,
  payerSelectionData,
}: props) {
  const pathname = usePathname();
  const params = useParams();
  const title =
    overrideTitle ?? getPageTitle(pathname, params.slug as string | undefined);

  return (
    <header className="border-b p-5">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex justify-between">
          <div>
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-3xl font-bold" data-testid="header-title">
                {title}
              </h1>
            </div>
            <Breadcrumb className="mt-2">
              <BreadcrumbList>
                {breadcrumbs?.map((item, index) => (
                  <Fragment key={item.title}>
                    <BreadcrumbItem
                      className={
                        index < breadcrumbs.length - 1 ? "hidden md:block" : ""
                      }
                    >
                      {item.href ? (
                        <BreadcrumbLink href={item.href}>
                          {item.title}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        {payerSelectionData && "Payer combobox here..."}
        <SignOutButton />
      </div>
    </header>
  );
}
