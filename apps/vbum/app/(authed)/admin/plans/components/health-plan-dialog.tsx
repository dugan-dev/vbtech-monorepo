"use client";

import { useState } from "react";
import { Pencil, PlusCircle } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
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
  healthPlanPubId?: string;
};

/**
 * Render a button-triggered dialog for adding or editing a health plan.
 *
 * When `formData` is provided the trigger and dialog are shown in "edit" mode;
 * otherwise they are shown in "add" mode. The dialog contains a HealthPlanForm
 * and closes when that form signals success.
 *
 * @param formData - Existing health plan data to populate the form; omit to open the dialog in "add" mode
 * @param clientPubId - Public identifier of the client the health plan belongs to
 * @returns The dialog element containing the trigger and the HealthPlanForm
 */
export function HealthPlanDialog({ formData, clientPubId }: props) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
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
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {formData ? "Edit Health Plan" : "Add Health Plan"}
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader className="px-6 flex flex-col bg-muted/30">
          <DialogTitle className="w-full text-center text-3xl bg-muted/30">
            {formData ? "Edit Health Plan" : "Add Health Plan"}
          </DialogTitle>
        </DialogHeader>
        <HealthPlanForm
          onSuccess={handleSuccess}
          formData={formData}
          clientPubId={clientPubId}
        />
      </DialogContent>
    </Dialog>
  );
}
