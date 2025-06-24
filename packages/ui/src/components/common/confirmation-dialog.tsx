import { AlertCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";

/**
 * Props for the ConfirmationDialog component.
 */
type props = {
  /** Whether the dialog is currently open */
  open: boolean;
  /** Callback to handle dialog open/close state changes */
  onOpenChange: (open: boolean) => void;
  /** Optional title for the dialog. Defaults to "Are you sure?" */
  title?: string;
  /** Description text explaining the action to be confirmed */
  description: string;
  /** Optional callback executed when cancel is clicked */
  onCancel?: () => void;
  /** Optional callback executed when confirm is clicked */
  onConfirm?: () => void;
  /** Text for the cancel button. Defaults to "No" */
  cancelText?: string;
  /** Text for the confirm button. Defaults to "Yes" */
  confirmText?: string;
};

/**
 * A reusable confirmation dialog component.
 *
 * This component provides a consistent way to ask users for confirmation before
 * performing potentially destructive or important actions. It uses an AlertDialog
 * with warning styling and customizable text.
 *
 * @param props - Configuration object containing dialog state, callbacks, and text
 * @returns ConfirmationDialog component with warning styling and action buttons
 */
export function ConfirmationDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  onCancel,
  onConfirm,
  cancelText = "No",
  confirmText = "Yes",
}: props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle
            className="flex items-center gap-2"
            data-testid="confirmation-dialog-title"
          >
            <AlertCircle className="h-6 w-6 text-destructive" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription data-testid="confirmation-dialog-description">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onCancel}
            data-testid="confirmation-dialog-cancel"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            data-testid="confirmation-dialog-confirm"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
