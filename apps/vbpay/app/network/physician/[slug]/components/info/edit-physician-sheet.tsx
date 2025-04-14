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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

import { Icons } from "@/components/icons";

import { EditPhysicianForm } from "./edit-physician-form/edit-physician-form";
import { EditPhysicianFormData } from "./edit-physician-form/edit-physician-form-schema";

type props = {
  formData: EditPhysicianFormData;
  payerPubId: string;
};

export function EditPhysicianSheet({ formData, payerPubId }: props) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSuccess = () => {
    setSheetOpen(false);
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="outline" onClick={() => setSheetOpen(true)}>
              <Icons.pencil className="h-4 w-4" />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>Edit Physician Info</TooltipContent>
      </Tooltip>

      <SheetContent side="top" className="h-screen w-screen border-none">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto">
            <SheetHeader className="px-6 py-4 border-b flex flex-col bg-muted/30">
              <SheetTitle className="w-full text-center text-3xl bg-muted/30">
                Edit Physician
              </SheetTitle>
            </SheetHeader>
            <EditPhysicianForm
              onSuccess={handleSuccess}
              formData={formData}
              payerPubId={payerPubId}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
