"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";

import { AddPayerForm } from "./add-payer-form/add-payer-form";

/**
 * Renders a button that opens a full-screen sheet for adding a new payer.
 *
 * The sheet contains a form to add a new payer and closes automatically when the form is successfully submitted.
 */
export function AddPayerSheet() {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSuccess = () => {
    setSheetOpen(false);
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
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
            <AddPayerForm onSuccess={handleSuccess} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
