"use client";

import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { ComboItem } from "@workspace/ui/types/combo-item";
import { DataTablePhysician } from "@workspace/ui/types/data-table-types";

import { Icons } from "@/components/icons";

import { SteppedUserForm } from "./user-form/stepped-user-form";

type props = {
  payers: ComboItem[];
  practices: ComboItem[];
  pos: ComboItem[];
  facilities: ComboItem[];
  vendors: ComboItem[];
  physicians: DataTablePhysician[];
};

export function AddUserSheet({
  payers,
  practices,
  pos,
  facilities,
  vendors,
  physicians,
}: props) {
  const [open, onOpenChange] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button onClick={() => onOpenChange(true)} disabled={isSubmitting}>
          <Icons.userPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-screen w-screen border-none">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto">
            <SteppedUserForm
              onSuccess={handleSuccess}
              physicians={physicians.map((physician) => ({
                label: physician.physDisplayName,
                value: physician.physPubId,
              }))}
              payers={payers}
              practices={practices}
              pos={pos}
              facilities={facilities}
              vendors={vendors}
              setIsSubmitting={setIsSubmitting}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
