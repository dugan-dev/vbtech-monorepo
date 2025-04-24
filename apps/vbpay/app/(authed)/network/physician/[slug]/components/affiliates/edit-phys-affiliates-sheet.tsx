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

import { EditPhysAffiliatesForm } from "./edit-affiliates-form/edit-phys-affiliates-form";
import { EditPhysAffiliatesFormData } from "./edit-affiliates-form/edit-phys-affiliates-schema";

type props = {
  formData: EditPhysAffiliatesFormData;
  payerPubId: string;
  pos: ComboItem[];
  practices: ComboItem[];
  facilities: ComboItem[];
  vendors: ComboItem[];
};

export function EditPhysAffiliatesSheet({
  formData,
  payerPubId,
  pos,
  practices,
  facilities,
  vendors,
}: props) {
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
        <TooltipContent>View Affiliates</TooltipContent>
      </Tooltip>

      <SheetContent side="top" className="h-screen w-screen border-none">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto">
            <SheetHeader className="px-6 py-4 border-b flex flex-col bg-muted/30">
              <SheetTitle className="w-full text-center text-3xl bg-muted/30">
                {isEditing ? "Edit Physician" : "View Physician"}
              </SheetTitle>
            </SheetHeader>
            <EditPhysAffiliatesForm
              onSuccess={handleSuccess}
              formData={formData}
              payerPubId={payerPubId}
              setIsEditing={setIsEditing}
              isEditing={isEditing}
              pos={pos}
              practices={practices}
              facilities={facilities}
              vendors={vendors}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
