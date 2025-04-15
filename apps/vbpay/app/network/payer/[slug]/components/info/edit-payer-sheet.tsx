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
import { ComboItem } from "@workspace/ui/types/combo-item";

import { Icons } from "@/components/icons";

import { EditPayerForm } from "./edit-payer-form/edit-payer-form";
import { EditPayerFormData } from "./edit-payer-form/edit-payer-form-schema";

type props = {
  payerTypes: ComboItem[];
  formData: EditPayerFormData;
};

/**
 * Renders a sheet for editing payer information.
 *
 * This component displays a button with a pencil icon, wrapped in a tooltip labeled "Edit Payer Info." Clicking the button opens a full-screen modal sheet,
 * which contains a header with "Edit Payer" and a form pre-populated with the provided payer data. When the form submission succeeds, the sheet is closed.
 *
 * @param payerTypes - Array of payer type options to populate the form.
 * @param formData - Initial payer data for the editing form.
 */
export function EditPayerSheet({ payerTypes, formData }: props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSuccess = () => {
    setSheetOpen(false);
  };

  // Reset editing state when sheet is closed
  const handleOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setIsEditing(false);
    }
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="outline" onClick={() => setSheetOpen(true)}>
              <Icons.eye className="h-4 w-4" />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>View Payer Info</TooltipContent>
      </Tooltip>

      <SheetContent side="top" className="h-screen w-screen border-none">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto">
            <SheetHeader className="px-6 py-4 border-b flex flex-col bg-muted/30">
              <SheetTitle className="w-full text-center text-3xl bg-muted/30">
                {isEditing ? "Edit Payer" : "View Payer"}
              </SheetTitle>
            </SheetHeader>
            <EditPayerForm
              onSuccess={handleSuccess}
              payerTypes={payerTypes}
              formData={formData}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
