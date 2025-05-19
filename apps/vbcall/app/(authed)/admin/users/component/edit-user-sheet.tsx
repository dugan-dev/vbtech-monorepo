"use client";

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

import { UserCognito } from "@/types/user-cognito";
import { Icons } from "@/components/icons";

import { SteppedUserForm } from "./user-form/stepped-user-form";

type props = {
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
 * @param isActionPending - A flag that disables the edit button while an action is in progress.
 * @param setIsActionPending - A function to update the pending state of the action.
 * @param open - Controls the open/closed state of the modal sheet.
 * @param onOpenChange - Callback to toggle the modal sheet's open state.
 */
export function EditUserSheet({
  user,
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
              setIsSubmitting={setIsActionPending}
              user={user}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
