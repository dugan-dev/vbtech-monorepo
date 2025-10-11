"use client";

import { PlusCircle, Stethoscope } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { DataTableSkeleton } from "@workspace/ui/components/data-table/data-table-skeleton";
import { ErrorDialog } from "@workspace/ui/components/error-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";

import { AppIcons } from "@/components/app-icons";
import { NppesNetworkPhysicianSearchForm } from "@/components/nppes-network-physician-search-form/nppes-network-physician-search-form";
import { NppesNetworkPhysicianResultsTable } from "@/components/nppes-network-physician-table/nppes-network-physician-table";

import { useAddNetworkPhysicianContext } from "../contexts/use-add-network-physician-context";
import { AddNetworkPhysicianForm } from "./add-network-physician-form/add-network-physician-form";

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
    handleNppesSelection,
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
          <PlusCircle className="mr-2 h-4 w-4" />
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
                  <Stethoscope className="h-5 w-5" />
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
            <AppIcons.nppesLogo
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
                  handleNppesSelection(data);
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
