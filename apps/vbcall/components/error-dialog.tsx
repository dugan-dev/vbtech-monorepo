import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";

import { Icons } from "@/components/icons";

type props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

/**
 * Renders an error dialog with customizable error details and an optional retry action.
 *
 * The dialog displays a title, error description, and action buttons. When an action callback is provided,
 * a secondary button is shown that invokes the callback and closes the dialog; otherwise, only a close button is displayed.
 *
 * @param open - Whether the dialog is visible.
 * @param onOpenChange - Callback to update the dialog's open state.
 * @param title - The error dialog's title. Defaults to "An error occurred".
 * @param description - The detailed error message.
 * @param actionLabel - The label for the action button if an action is provided. Defaults to "Retry".
 * @param onAction - Optional callback executed when the action button is clicked.
 *
 * @returns The AlertDialog component configured with error information and action buttons.
 */
export function ErrorDialog({
  open,
  onOpenChange,
  title = "An error occurred",
  description,
  actionLabel = "Retry",
  onAction,
}: props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[80dvw] max-h-[80dvh] overflow-auto">
        <AlertDialogHeader>
          <AlertDialogTitle
            className="flex items-center gap-2"
            data-testid="error-dialog-title"
          >
            <Icons.alertCircle className="h-6 w-6 text-destructive" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription data-testid="error-dialog-description">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {onAction && (
            <Button
              variant="secondary"
              onClick={() => {
                onAction();
                onOpenChange(false);
              }}
              data-testid="error-dialog-action-button"
            >
              {actionLabel}
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={() => onOpenChange(false)}
            data-testid="error-dialog-close-button"
          >
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
