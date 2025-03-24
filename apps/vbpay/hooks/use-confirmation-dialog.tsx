import { useRef, useState } from "react";

type props = {
  onConfirmBeforeAsync?: () => void;
  onConfirmAsync?: () => Promise<void>;
  onConfirmAfterAsync?: () => void;
};

export function useConfirmationDialog({
  onConfirmBeforeAsync,
  onConfirmAsync,
  onConfirmAfterAsync,
}: props) {
  const [isConfDialogOpen, setIsConfDialogOpen] = useState(false);
  const confDialogTitle = useRef("");
  const confDialogMsg = useRef("");

  const openConfDialog = (title: string, msg: string) => {
    setIsConfDialogOpen(true);
    confDialogTitle.current = title;
    confDialogMsg.current = msg;
  };

  const close = () => {
    confDialogTitle.current = "";
    confDialogMsg.current = "";
    setIsConfDialogOpen(false);
  };

  const confirm = async () => {
    onConfirmBeforeAsync && onConfirmBeforeAsync();
    onConfirmAsync && (await onConfirmAsync());
    onConfirmAfterAsync && onConfirmAfterAsync();
    close();
  };

  const cancel = () => {
    close();
  };

  return {
    isConfDialogOpen,
    openConfDialog,
    confirm,
    cancel,
    confDialogTitle: confDialogTitle.current,
    confDialogMsg: confDialogMsg.current,
  };
}
