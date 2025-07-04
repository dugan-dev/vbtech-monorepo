"use client";

import { UserCog } from "lucide-react";

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

import { SteppedUserForm } from "./user-form/stepped-user-form";

type props = {
  physicians: DataTablePhysician[];
  payers: ComboItem[];
  practices: ComboItem[];
  pos: ComboItem[];
  facilities: ComboItem[];
  vendors: ComboItem[];
  user: UserCognito;
  isActionPending: boolean;
  setIsActionPending: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};
/**
 * Renders a modal sheet with a multi-step form for editing a user's details.
 *
 * The component displays an icon button that opens a modal sheet when clicked. The modal contains a form pre-populated with user information and several selection options that include physicians (transformed for display), payers, practices, point-of-service options, facilities, and vendors. The sheet's visibility and the action's pending state are externally controlled via the provided props.
 *
 * @param user - The user data to be edited.
 * @param physicians - An array of physician objects, which are mapped to display options in the form.
 * @param payers - An array of payer options available for selection.
 * @param practices - An array of practice options available for selection.
 * @param pos - An array of point-of-service options.
 * @param facilities - An array of facility options available for selection.
 * @param vendors - An array of vendor options available for selection.
 * @param isActionPending - A flag that disables the edit button while an action is in progress.
 * @param setIsActionPending - A function to update the pending state of the action.
 * @param open - Controls the open/closed state of the modal sheet.
 * @param onOpenChange - Callback to toggle the modal sheet's open state.
 */
export function EditUserSheet({
  user,
  physicians,
  payers,
  practices,
  pos,
  facilities,
  vendors,
  isActionPending,
  setIsActionPending,
  open,
  onOpenChange,
}: props) {
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
              disabled={isActionPending}
            >
              <UserCog className="size-5" />
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
              setIsSubmitting={setIsActionPending}
              user={user}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
