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

import { PhysicianForm } from "./physician-form/physician-form";
import { PhysicianFormData } from "./physician-form/physician-form-schema";

type props = {
  formData?: PhysicianFormData;
  physPubId?: string;
};

export function PhysicianDialog({ formData, physPubId }: props) {
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
                Add Physician
              </Button>
            )}
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {formData ? "Edit Physician" : "Add Physician"}
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader className="px-6 flex flex-col bg-muted/30">
          <DialogTitle className="w-full text-center text-3xl bg-muted/30">
            {formData ? "Edit Physician" : "Add Physician"}
          </DialogTitle>
        </DialogHeader>
        <PhysicianForm
          onSuccess={handleSuccess}
          formData={formData}
          physPubId={physPubId}
        />
      </DialogContent>
    </Dialog>
  );
}
