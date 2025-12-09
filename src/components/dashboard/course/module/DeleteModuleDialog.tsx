import { FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteModuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  moduleTitle: string;
  t: any;
}

export const DeleteModuleDialog: FC<DeleteModuleDialogProps> = ({ isOpen, onClose, onConfirm, moduleTitle, t }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">{t("dialogs.deleteModuleConfirmationTitle")}</DialogTitle>
          <DialogDescription>
            {t("dialogs.deleteModuleConfirmationBody", { title: moduleTitle })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>{t("buttons.cancel")}</Button>
          <Button variant="destructive" onClick={onConfirm}>{t("buttons.deleteModule")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};