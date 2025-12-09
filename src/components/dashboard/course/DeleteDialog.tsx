"use client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import type { Course } from "@/types/course";

interface DeleteDialogProps {
  open: boolean;
  course?: Course | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  t: any;
}

export function DeleteDialog({ open, course, onOpenChange, onConfirm, t }: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-red-600">
            <Trash2 className="mr-2 h-6 w-6" /> {t("dialog.deleteTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("dialog.deleteDescription")}
            {course && (
              <span className="font-semibold text-foreground block mt-2">
                &quot;{course.title}&quot;
              </span>
            )}
            <span className="block mt-2 font-medium">{t("dialog.confirmWarning")}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("dialog.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            {t("dialog.deleteAction")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
