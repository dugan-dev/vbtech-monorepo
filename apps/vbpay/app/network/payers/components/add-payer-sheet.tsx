"use client";

import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { ComboItem } from "@workspace/ui/types/combo-item";

import { Icons } from "@/components/icons";

import { AddPayerForm } from "./add-payer-form/add-payer-form";

type props = {
  payerTypes: ComboItem[];
};

/**
 * Renders a sliding sheet interface for adding a new payer.
 *
 * This component displays a button that opens a full-screen sheet containing the AddPayerForm. When a new payer is added successfully, the sheet is closed.
 *
 * @param payerTypes - A collection of payer type options used to populate the add payer form.
 * @returns A JSX element representing the add payer sheet interface.
 */
export function AddPayerSheet({ payerTypes }: props) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSuccess = () => {
    setSheetOpen(false);
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button>
          <Icons.plusCircle className="mr-2 h-4 w-4" />
          Add Payer
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-screen w-screen border-none">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto">
            <SheetHeader className="px-6 py-4 border-b flex flex-col bg-muted/30">
              <SheetTitle className="w-full text-center text-3xl bg-muted/30">
                Add New Payer
              </SheetTitle>
            </SheetHeader>
            <AddPayerForm onSuccess={handleSuccess} payerTypes={payerTypes} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
