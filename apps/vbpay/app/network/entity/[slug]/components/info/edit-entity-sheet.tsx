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

import { EditEntityForm } from "./edit-entity-form/edit-entity-form";
import { EditEntityFormData } from "./edit-entity-form/edit-entity-form-schema";

type props = {
  formData: EditEntityFormData;
  payerPubId: string;
};

/**
 * Displays a slide-over sheet for viewing and editing a network entity's information.
 *
 * The sheet opens in view mode by default and allows toggling to edit mode. On successful form submission, the sheet closes. Closing the sheet always resets it to view mode.
 *
 * @param formData - The initial data to populate the entity form.
 * @param payerPubId - The public identifier associated with the entity.
 */
export function EditEntitySheet({ formData, payerPubId }: props) {
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
        <TooltipContent>View Entity Info</TooltipContent>
      </Tooltip>

      <SheetContent side="top" className="h-screen w-screen border-none">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto">
            <SheetHeader className="px-6 py-4 border-b flex flex-col bg-muted/30">
              <SheetTitle className="w-full text-center text-3xl bg-muted/30">
                {isEditing ? "Edit" : "View"} Network Entity
              </SheetTitle>
            </SheetHeader>
            <EditEntityForm
              isEditing={isEditing}
              setIsEditing={setIsEditing}
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
