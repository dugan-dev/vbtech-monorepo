"use client";

import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { ComboItem } from "@workspace/ui/types/combo-item";
import { DataTablePhysician } from "@workspace/ui/types/data-table-types";

import { UserCognito } from "@/types/user-cognito";
import { Icons } from "@/components/icons";

import { SteppedUserForm } from "./user-form/stepped-user-form";

type props = {
  physicians: DataTablePhysician[];
  payers: ComboItem[];
  practices: ComboItem[];
  pos: ComboItem[];
  facilities: ComboItem[];
  vendors: ComboItem[];
  user: UserCognito;
};
export function EditUserSheet({
  user,
  physicians,
  payers,
  practices,
  pos,
  facilities,
  vendors,
}: props) {
  const [open, onOpenChange] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onOpenChange(true)}
              disabled={isSubmitting}
            >
              <Icons.userCog className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit User</p>
          </TooltipContent>
        </Tooltip>
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
              user={user}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
