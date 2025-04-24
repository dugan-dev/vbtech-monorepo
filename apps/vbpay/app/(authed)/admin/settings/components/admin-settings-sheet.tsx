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

import { Icons } from "@/components/icons";
import { SetupFormData } from "@/components/setup-form/setup-form-schema";

import { SteppedAdminSettingsForm } from "./stepped-admin-settings-form";

type props = {
  data: SetupFormData;
  from: "license" | "settings";
};

export function AdminSettingsSheet({ data, from }: props) {
  const [open, onOpenChange] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              onClick={() => onOpenChange(true)}
              disabled={isSubmitting}
              size="icon"
              variant="outline"
            >
              <Icons.pencil className="h-4 w-4" />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Update {from === "license" ? "License" : "Global Settings"}</p>
        </TooltipContent>
      </Tooltip>
      <SheetContent side="top" className="h-screen w-screen border-none">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto">
            <SteppedAdminSettingsForm
              onSuccess={handleSuccess}
              setIsSubmitting={setIsSubmitting}
              data={data}
              from={from}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
