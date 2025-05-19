"use client";

import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";

import { Icons } from "@/components/icons";

import { SteppedUserForm } from "./user-form/stepped-user-form";

export function AddUserSheet() {
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
              setIsSubmitting={setIsSubmitting}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
