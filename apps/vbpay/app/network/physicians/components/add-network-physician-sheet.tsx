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
import { NppesNetworkPhysicianSearchForm } from "@/components/nppes-network-physician-search-form/nppes-network-physician-search-form";
import { NppesNetworkPhysicianResultsTable } from "@/components/nppes-network-physician-table/nppes-network-physician-table";

import { useAddNetworkPhysicianContext } from "../contexts/use-add-network-physician-context";
import { AddNetworkPhysicianForm } from "./add-network-physician-form/add-network-physician-form";

/**
 * Renders a modal sheet for adding a network physician.
 *
 * This component leverages a shared context to control modal visibility, current view state, and search interactions. It conditionally displays:
 * - An error dialog when an error is present,
 * - A trigger button for opening the sheet,
 * - A header with the "Add Network Physician" title,
 * - Either an advanced NPPES search form (encapsulated in a card) or a new physician form depending on the sheet mode,
 * - A toggle button to switch between an advanced search view and the new physician form,
 * - An NPPES logo indicator when in search or advanced mode,
 * - And either a results table or a loading skeleton based on the status of the NPPES search.
 */
export function AddNetworkPhysicianSheet() {
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
  } = useAddNetworkPhysicianContext();

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
          {"Add Network Physician"}
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-screen w-screen border-none">
        <SheetHeader className="px-6 py-4 border-b flex flex-col bg-muted/30">
          <SheetTitle className="w-full text-center text-3xl bg-muted/30">
            Add Network Physician
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 mx-auto flex-1 xl:max-w-[80dvw] py-1">
          {sheetState === "advanced" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.stethoscope className="h-5 w-5" />
                  Advanced Physician Search via NPPES
                </CardTitle>
                <CardDescription>
                  Enter the physician&apos;s information and compare with NPPES
                  data to verify.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <NppesNetworkPhysicianSearchForm form={nppesSearchForm} />
              </CardContent>
            </Card>
          )}
          {(sheetState === "form" || sheetState === "search") && (
            <AddNetworkPhysicianForm />
          )}
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
                : "Back to New Physician Form"}
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
              <NppesNetworkPhysicianResultsTable
                nppesResults={nppesApiResponseData}
                handleReturnFormData={(data) => {
                  setNppesSearchSelection(data);
                }}
              />
            )}
          {(sheetState === "advanced" || sheetState === "search") &&
            isNppesSearchPending && (
              <DataTableSkeleton
                columnCount={9}
                rowCount={5}
                showViewOptions={false}
                heightPercent={40}
              />
            )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
