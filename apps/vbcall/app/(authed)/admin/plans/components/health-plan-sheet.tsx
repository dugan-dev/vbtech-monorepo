"use client";

import { useState } from "react";
import { Pencil, PlusCircle } from "lucide-react";

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

import { HealthPlanForm } from "./health-plan-form/health-plan-form";
import { HealthPlanFormData } from "./health-plan-form/health-plan-form-schema";

type props = {
  formData?: HealthPlanFormData;
  clientPubId: string;
  pubId?: string;
};

/**
 * Displays a sheet UI for adding or editing a health plan.
 *
 * Renders a button that opens a full-screen sheet containing a health plan form. The button and tooltip adapt based on whether {@link formData} is provided, supporting both add and edit modes. The sheet closes automatically upon successful form submission.
 *
 * @param formData - Existing health plan data to edit, or undefined to add a new plan.
 * @param clientPubId - Identifier for the client associated with the health plan.
 * @param pubId - Identifier for the health plan, used in edit mode.
 */
export function HealthPlanSheet({ formData, clientPubId, pubId }: props) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            {formData ? (
              <Button size="icon" variant="secondary">
                <Pencil className="h-4 w-4" />
              </Button>
            ) : (
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Health Plan
              </Button>
            )}
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {formData ? "Edit Health Plan" : "Add Health Plan"}
        </TooltipContent>
      </Tooltip>
      <SheetContent side="top" className="h-screen w-screen border-none">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto">
            <HealthPlanForm
              onSuccess={handleSuccess}
              formData={formData}
              clientPubId={clientPubId}
              pubId={pubId}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
