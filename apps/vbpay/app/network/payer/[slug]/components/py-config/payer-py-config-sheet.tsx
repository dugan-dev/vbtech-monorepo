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

import { PayerPyConfigFormData } from "./payer-py-config-form-schema";
import { SteppedPayerPyConfigForm } from "./stepped-payer-py-config-form";

type props = {
  data?: PayerPyConfigFormData; // required for edit/update
  pubId?: string; // required for edit/update
  payerPubId?: string; // required for create/insert
};

/**
 * Displays a sheet for adding or viewing payer configuration data, with a form that adapts to create or update mode based on provided props.
 *
 * The sheet is triggered by a button whose appearance and tooltip reflect the current mode. When editing, the form is prepopulated with existing data. The sheet closes automatically after a successful submission, and editing state is reset when the sheet is closed.
 *
 * @param data - Configuration data used to prepopulate the form in update mode.
 * @param pubId - Identifier for the configuration being viewed or edited.
 * @param payerPubId - Identifier used when creating a new configuration.
 */
export function PayerPyConfigSheet({ data, pubId, payerPubId }: props) {
  const [open, onOpenChange] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  // Reset editing state when sheet is closed
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setIsEditing(false);
    }
  };

  const isUpdate = data && pubId ? true : false;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              variant={isUpdate ? "outline" : "default"}
              onClick={() => onOpenChange(true)}
              disabled={isSubmitting}
              className={!isUpdate ? "w-full" : undefined}
            >
              {isUpdate && <Icons.eye className="h-4 w-4" />}
              {!isUpdate && <span>Add PY Configuration</span>}
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {data && pubId ? "View" : "Add"} Payer Py Config
        </TooltipContent>
      </Tooltip>
      <SheetContent side="top" className="h-screen w-screen border-none">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto">
            <SteppedPayerPyConfigForm
              onSuccess={handleSuccess}
              setIsSubmitting={setIsSubmitting}
              data={data}
              payerPubId={payerPubId}
              pubId={pubId}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
