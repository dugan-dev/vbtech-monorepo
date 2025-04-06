"use client";

import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";

import { SteppedSetupForm } from "./stepped-setup-form";

/**
 * Renders a modal sheet for managing the setup process.
 *
 * This component displays a "Complete Setup" button that opens a full-screen modal sheet when clicked.
 * Within the sheet, the setup process is handled by the `SteppedSetupForm` component. On successful completion,
 * the sheet is closed, and the button remains disabled while a submission is in progress.
 */
export function SetupSheet() {
  const [open, onOpenChange] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button onClick={() => onOpenChange(true)} disabled={isSubmitting}>
          Complete Setup
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-screen w-screen border-none">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto">
            <SteppedSetupForm
              onSuccess={handleSuccess}
              setIsSubmitting={setIsSubmitting}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
