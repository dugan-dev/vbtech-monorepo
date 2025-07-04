"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

import { PhysPyConfigForm } from "./phys-py-config-form";
import { PhysPyConfigFormData } from "./phys-py-config-form-schema";

type props = {
  data?: PhysPyConfigFormData; // required for edit/update
  pubId?: string; // required for edit/update
  payerPubId: string; // required for permission checks
};

/**
 * Displays a dialog for viewing or adding a physician PY configuration.
 *
 * The dialog adapts its content and controls based on whether existing configuration data and a public identifier are provided, allowing users to either view/edit an existing configuration or add a new one.
 *
 * @param data - Existing configuration data for view/edit mode.
 * @param pubId - Public identifier for the configuration, required for view/edit mode.
 * @param payerPubId - Identifier used for permission checks and form submission.
 */
export function PhysPyConfigDialog({ data, pubId, payerPubId }: props) {
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant={isUpdate ? "outline" : "default"}
              onClick={() => onOpenChange(true)}
              disabled={isSubmitting}
              className={!isUpdate ? "w-full" : undefined}
            >
              {isUpdate && <Eye className="h-4 w-4" />}
              {!isUpdate && <span>Add PY Configuration</span>}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {data && pubId ? "View" : "Add"} Py Config
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogTitle>
          {data && pubId ? "View PY Config" : "Add PY Config"}
        </DialogTitle>
        <PhysPyConfigForm
          onSuccess={handleSuccess}
          setIsSubmitting={setIsSubmitting}
          data={data}
          payerPubId={payerPubId}
          pubId={pubId}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      </DialogContent>
    </Dialog>
  );
}
