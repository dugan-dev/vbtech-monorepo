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
};

/**
 * Renders a sheet interface for editing network entity information.
 *
 * The component displays a button with a pencil icon wrapped in a tooltip labeled "Edit Entity Info." Clicking the button opens a full-screen sheet containing an edit form. The form is pre-populated using the provided data, and upon a successful submission, the sheet is closed.
 *
 * @param formData - The data used to initialize and configure the edit entity form.
 */
export function EditEntitySheet({ formData }: props) {
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
        <TooltipContent>Edit Entity Info</TooltipContent>
      </Tooltip>

      <SheetContent side="top" className="h-screen w-screen border-none">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto">
            <SheetHeader className="px-6 py-4 border-b flex flex-col bg-muted/30">
              <SheetTitle className="w-full text-center text-3xl bg-muted/30">
                Edit Network Entity
              </SheetTitle>
            </SheetHeader>
            <EditEntityForm onSuccess={handleSuccess} formData={formData} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
