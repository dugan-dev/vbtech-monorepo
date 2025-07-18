"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

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

import { EditPayerForm } from "./edit-payer-form/edit-payer-form";
import { EditPayerFormData } from "./edit-payer-form/edit-payer-form-schema";

type props = {
  formData: EditPayerFormData;
};

/**
 * Displays a button that opens a full-screen modal sheet for viewing and editing payer information.
 *
 * The sheet allows users to toggle between view and edit modes for the payer details. It closes automatically after a successful form submission.
 *
 * @param formData - Initial payer data used to populate the form fields.
 */
export function EditPayerSheet({ formData }: props) {
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
              <Eye className="h-4 w-4" />
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
