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

import { EditPhysicianForm } from "./edit-physician-form/edit-physician-form";
import { EditPhysicianFormData } from "./edit-physician-form/edit-physician-form-schema";

type props = {
  formData: EditPhysicianFormData;
  payerPubId: string;
};

/**
 * Displays a sheet for viewing and editing physician information, allowing users to toggle between view and edit modes.
 *
 * The sheet opens from the top of the screen and presents physician details using the provided {@link formData}. Users can switch to editing mode within the sheet, and any successful update will close the sheet. Editing mode is reset whenever the sheet is closed.
 *
 * @param formData - The physician data to display and edit.
 * @param payerPubId - The payer public identifier associated with the physician.
 */
export function EditPhysicianSheet({ formData, payerPubId }: props) {
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
        <TooltipContent>View Physician Info</TooltipContent>
      </Tooltip>

      <SheetContent side="top" className="h-screen w-screen border-none">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto">
            <SheetHeader className="px-6 py-4 border-b flex flex-col bg-muted/30">
              <SheetTitle className="w-full text-center text-3xl bg-muted/30">
                {isEditing ? "Edit Physician" : "View Physician"}
              </SheetTitle>
            </SheetHeader>
            <EditPhysicianForm
              onSuccess={handleSuccess}
              formData={formData}
              payerPubId={payerPubId}
              setIsEditing={setIsEditing}
              isEditing={isEditing}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
