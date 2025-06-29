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

type props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
};

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
