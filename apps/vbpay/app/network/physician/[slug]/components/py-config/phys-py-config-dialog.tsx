"use client";

import { useState } from "react";

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

import { Icons } from "@/components/icons";

import { PhysPyConfigForm } from "./phys-py-config-form";
import { PhysPyConfigFormData } from "./phys-py-config-form-schema";

type props = {
  data?: PhysPyConfigFormData; // required for edit/update
  pubId?: string; // required for edit/update
  payerPubId?: string; // required for create/insert
};

/**
 * Displays a dialog for viewing or adding a physician PY configuration.
 *
 * The dialog toggles between "view" and "add" modes based on the presence of {@link data} and {@link pubId}. It renders a trigger button with dynamic text and icon, and manages dialog visibility, editing state, and submission status. The dialog contains a form for creating or viewing configuration details.
 *
 * @param data - Existing configuration data for viewing or editing.
 * @param pubId - Identifier for the configuration, required for viewing or editing.
 * @param payerPubId - Identifier used when creating a new configuration.
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
              {isUpdate && <Icons.eye className="h-4 w-4" />}
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
