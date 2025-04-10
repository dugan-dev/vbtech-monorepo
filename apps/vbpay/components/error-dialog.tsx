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
