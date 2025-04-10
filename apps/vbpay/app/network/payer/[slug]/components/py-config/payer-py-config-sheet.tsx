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
 * Renders a sheet interface for adding or editing payer configuration data.
 *
 * The component determines its mode (create or update) based on the presence of
 * both "data" and "pubId". A button toggles the sheet visibility and adapts its
 * appearance accordingly. When the form submission is in progress, the button is
 * disabled. Upon a successful submission, the sheet automatically closes.
 *
 * @param data - Optional configuration data to prepopulate the form in update mode.
 * @param pubId - Optional identifier for the configuration to be edited.
 * @param payerPubId - Optional identifier used when creating a new configuration.
 */
export function PayerPyConfigSheet({ data, pubId, payerPubId }: props) {
  const [open, onOpenChange] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  const isUpdate = data && pubId ? true : false;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              variant={isUpdate ? "outline" : "default"}
              onClick={() => onOpenChange(true)}
              disabled={isSubmitting}
              className={!isUpdate ? "w-full" : undefined}
            >
              {isUpdate && <Icons.pencil className="h-4 w-4" />}
              {!isUpdate && <span>Add PY Configuration</span>}
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {data && pubId ? "Edit" : "Add"} Payer Py Config
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
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
