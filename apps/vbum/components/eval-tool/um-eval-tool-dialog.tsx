"use client";

import { HeartPulse } from "lucide-react";

import { Badge } from "@workspace/ui/components/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Separator } from "@workspace/ui/components/separator";

type props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  procedureCode: string;
  codeDescription?: string;
};

/**
 * Render a modal dialog that displays a placeholder UM (Utilization Management) evaluation UI for a given procedure code.
 *
 * @param open - Whether the dialog is visible
 * @param onOpenChange - Callback invoked when the dialog open state changes
 * @param procedureCode - Procedure code shown in the dialog header and body
 * @param codeDescription - Optional human-readable description of the procedure code
 * @returns The rendered UM Evaluation Tool dialog element
 */
export function UmEvalToolDialog({
  open,
  onOpenChange,
  procedureCode,
  codeDescription,
}: props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-primary" />
            <DialogTitle>UM Evaluation Tool</DialogTitle>
          </div>
          <DialogDescription>
            Guided review steps for procedure code{" "}
            <Badge variant="outline" className="font-mono">
              {procedureCode}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-6 py-4">
          {/* Placeholder content - will be replaced with actual UM eval tool */}
          <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
            <HeartPulse className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">UM Evaluation Tool</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This is a placeholder for the UM evaluation tool interface.
            </p>
            <div className="text-left max-w-md mx-auto space-y-2">
              <p className="text-sm">
                <span className="font-medium">Procedure Code:</span>{" "}
                {procedureCode}
              </p>
              {codeDescription && (
                <p className="text-sm">
                  <span className="font-medium">Description:</span>{" "}
                  {codeDescription}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-4">
                The guided review steps, clinical criteria, and decision support
                tools will be displayed here.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}