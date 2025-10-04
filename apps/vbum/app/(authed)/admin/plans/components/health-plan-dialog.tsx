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
                Add Client
              </Button>
            )}
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {formData ? "Edit Client" : "Add Client"}
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader className="px-6 flex flex-col bg-muted/30">
          <DialogTitle className="w-full text-center text-3xl bg-muted/30">
            {formData ? "Edit Client" : "Add Client"}
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
