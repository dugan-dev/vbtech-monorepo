import { useState } from "react";

type props = {
  onConfirmBeforeAsync?: () => void;
  onConfirmAsync?: () => Promise<void>;
  onConfirmAfterAsync?: () => void;
};

/**
 * Manages the state and behavior of a confirmation dialog.
 *
 * This custom React hook provides functions to open, confirm, and cancel a confirmation dialog with a specified title and message.
 * When confirming, it sequentially invokes an optional pre-confirm callback, an asynchronous confirmation action, and an optional post-confirm callback before closing the dialog.
 *
 * @param props - An object containing optional callbacks:
 *   - onConfirmBeforeAsync: Invoked before starting the async confirmation, if provided.
 *   - onConfirmAsync: An async function executed to perform the confirmation process, if provided.
 *   - onConfirmAfterAsync: Invoked after the async confirmation completes, if provided.
 *
 * @returns An object with:
 *   - isConfDialogOpen: A boolean indicating whether the dialog is open.
 *   - openConfDialog: A function to open the dialog with a given title and message.
 *   - confirm: A function that processes the confirmation flow and closes the dialog.
 *   - cancel: A function to cancel and close the dialog.
 *   - confDialogTitle: The current title of the dialog.
 *   - confDialogMsg: The current message of the dialog.
 */
export function useConfirmationDialog({
  onConfirmBeforeAsync,
  onConfirmAsync,
  onConfirmAfterAsync,
}: props) {
  const [isConfDialogOpen, setIsConfDialogOpen] = useState(false);
  const [confDialogTitle, setConfDialogTitle] = useState("");
  const [confDialogMsg, setConfDialogMsg] = useState("");

  const openConfDialog = (title: string, msg: string) => {
    setConfDialogTitle(title);
    setConfDialogMsg(msg);
    setIsConfDialogOpen(true);
  };

  const close = () => {
    setIsConfDialogOpen(false);
    setConfDialogTitle("");
    setConfDialogMsg("");
  };

  const confirm = async () => {
    try {
      onConfirmBeforeAsync?.();
      if (onConfirmAsync) {
        await onConfirmAsync();
      }
      onConfirmAfterAsync?.();
    } finally {
      close();
    }
  };

  const cancel = () => {
    close();
  };

  return {
    isConfDialogOpen,
    openConfDialog,
    confirm,
    cancel,
    confDialogTitle,
    confDialogMsg,
  };
}
