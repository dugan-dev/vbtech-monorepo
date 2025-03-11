import { useRef, useState } from "react";

type props<T> = {
  onConfirmBeforeAsync?: (data?: T) => void;
  onConfirmAsync?: (data?: T) => Promise<void>;
  onConfirmAfterAsync?: (data?: T) => void;
};

export function useConfirmationDialog<T>({
  onConfirmBeforeAsync,
  onConfirmAsync,
  onConfirmAfterAsync,
}: props<T>) {
  const [isConfDialogOpen, setIsConfDialogOpen] = useState(false);
  const confDialogTitle = useRef("");
  const confDialogMsg = useRef("");

  const openConfDialog = (title: string, msg: string) => {
    setIsConfDialogOpen(true);
    confDialogTitle.current = title;
    confDialogMsg.current = msg;
  };

  const close = () => setIsConfDialogOpen(false);

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
