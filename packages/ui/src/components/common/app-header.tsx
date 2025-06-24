"use client";

import { Fragment } from "react";

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
import { BreadcrumbItemType } from "@workspace/ui/types/breadcrumb-item";
import { UserSelectionData } from "@workspace/ui/types/user-selection-data";

import { SignoutButton } from "./signout-button";
import { UserSelectionCombo } from "./user-selection-combo";

type AppHeaderProps = {
  breadcrumbs?: BreadcrumbItemType[];
  overrideTitle?: string;
  userSelectionData?: UserSelectionData;
  getPageTitle: (pathname: string, slug?: string) => string;
  signOut: () => Promise<void>;
  onSignOut?: () => void;
  userSelectionInstructText: string;
  userSelectionNotFoundText: string;
  userSelectionSearchText: string;
  userSelectionUpdate: (vars: { slug: string }) => void;
  userSelectionIcons: {
    chevronsUpDown: React.ReactNode;
    check: React.ReactNode;
    lock: React.ReactNode;
    unlock: React.ReactNode;
  };
  userSelectionValue: string;
  onUserSelectionValueChange: (value: string) => void;
  pathname: string;
  slug?: string;
};

export function AppHeader({
  breadcrumbs,
  overrideTitle,
  userSelectionData,
  getPageTitle,
  signOut,
  onSignOut,
  userSelectionInstructText,
  userSelectionNotFoundText,
  userSelectionSearchText,
  userSelectionUpdate,
  userSelectionIcons,
  userSelectionValue,
  onUserSelectionValueChange,
  pathname,
  slug,
}: AppHeaderProps) {
  const title = overrideTitle ?? getPageTitle(pathname, slug);

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
        {userSelectionData && (
          <UserSelectionCombo
            {...userSelectionData}
            instructText={userSelectionInstructText}
            notFoundText={userSelectionNotFoundText}
            searchText={userSelectionSearchText}
            updateSelection={userSelectionUpdate}
            icons={userSelectionIcons}
            value={userSelectionValue}
            onValueChange={onUserSelectionValueChange}
          />
        )}
        <SignoutButton signOut={signOut} onSignOut={onSignOut} />
      </div>
    </header>
  );
}
