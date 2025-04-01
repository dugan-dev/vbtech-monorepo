"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";

import { ErrorDialog } from "@/components/error-dialog";
import { Icons } from "@/components/icons";
import { NppesNetworkEntitySearchForm } from "@/components/nppes-network-entity-search-form/nppes-network-entity-search-form";
import { NppesNetworkEntityResultsTable } from "@/components/nppes-network-entity-table/nppes-network-entity-table";

import { useAddNetworkEntityContext } from "../contexts/add-network-entity-context";
import { AddNetworkEntityForm } from "./add-network-entity-form/add-network-entity-form";

/**
 * Renders a sheet interface for adding a network entity.
 *
 * This component provides a multi-step UI for adding a network entity with options for an advanced
 * NPPES search or a direct entry form. It manages its state via a context provider and conditionally
 * displays an error dialog when needed. Depending on the current mode, it toggles between an advanced
 * search view—with a NPPES search form and results (or a loading indicator if a search is pending)—and
 * a basic network entity form.
 *
 * @returns The rendered add network entity sheet component.
 */
export function AddNetworkEntitySheet() {
  const {
    sheetOpen,
    setSheetOpen,
    sheetState,
    setSheetState,
    nppesSearchForm,
    isErrorDialogOpen,
    errorMsg,
    errorTitle,
    closeErrorDialog,
    setNppesSearchSelection,
    nppesApiResponseData,
    isNppesSearchPending,
  } = useAddNetworkEntityContext();

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      {isErrorDialogOpen && (
        <ErrorDialog
          open={isErrorDialogOpen}
          onOpenChange={closeErrorDialog}
          description={errorMsg ?? ""}
          title={errorTitle}
        />
      )}
      <SheetTrigger asChild>
        <Button>
          <Icons.plusCircle className="mr-2 h-4 w-4" />
          {"Add Network Entity"}
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-screen w-screen border-none">
        <SheetHeader className="px-6 py-4 border-b flex flex-col bg-muted/30">
          <SheetTitle className="w-full text-center text-3xl bg-muted/30">
            Add Network Entity
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 mx-auto flex-1 xl:max-w-[80dvw] py-4">
          {sheetState === "advanced" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.stethoscope className="h-5 w-5" />
                  Advanced Entity Search via NPPES
                </CardTitle>
                <CardDescription>
                  Enter the entity&apos;s information and compare with NPPES
                  data to verify.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <NppesNetworkEntitySearchForm form={nppesSearchForm} />
              </CardContent>
            </Card>
          )}
          {sheetState === "search" && <AddNetworkEntityForm />}
          {(sheetState === "search" || sheetState === "advanced") && (
            <Button
              onClick={() =>
                sheetState === "search"
                  ? setSheetState("advanced")
                  : setSheetState("search")
              }
              variant="link"
              className="self-start -mt-4"
            >
              {sheetState === "search"
                ? "Advanced Search"
                : "Back to New Network Entity Form"}
            </Button>
          )}
          {(sheetState === "search" || sheetState === "advanced") && (
            <Icons.nppesLogo
              className="bg-white p-2 rounded-md ml-2"
              width={150}
              height={120}
            />
          )}
          {(sheetState === "advanced" || sheetState === "search") &&
            !isNppesSearchPending && (
              <NppesNetworkEntityResultsTable
                nppesResults={nppesApiResponseData}
                handleReturnFormData={(data) => {
                  setNppesSearchSelection(data);
                }}
              />
            )}
          {(sheetState === "advanced" || sheetState === "search") &&
            isNppesSearchPending && (
              <DataTableSkeleton
                columnCount={6}
                rowCount={3}
                showViewOptions={false}
                withPagination={false}
                heightPercent={40}
              />
            )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
