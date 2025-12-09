// src/components/course/lesson/DeleteLessonDialog.tsx
"use client";

import { FC, useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import api from "@/lib/apiHandler";
import { Lesson } from "@/types/course"; // Import Lesson type
import { useToast } from "@/components/ui/use-toast";

// Shadcn/ui components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// --- Component Props Type ---
interface DeleteLessonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (lessonId: string) => void; // Callback to notify parent (e.g., refresh list)
  lesson: Lesson | null; // The lesson to be deleted
  t: any; // i18n translation function
}

export const DeleteLessonDialog: FC<DeleteLessonDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  lesson,
  t
}) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirmed = async () => {
    if (!lesson) return;

    setIsDeleting(true);
    try {
      // DELETE LESSON
      await api.delete(`/admin/lesson/${lesson.id}`);

      toast({
        title: t("toast.deleteSuccessTitle"),
        description: t("toast.deleteSuccessDescription", { title: lesson.title }),
      });

      // Trigger parent callback and close
      onConfirm(lesson.id);
      onClose();

    } catch (error) {
      console.error("Error deleting lesson:", error);
      const errorMessage = (error as any)?.response?.data?.message || t("toast.apiErrorFallback");

      toast({
        title: t("toast.errorTitle"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!lesson) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600 flex items-center">
            <Trash2 className="w-5 h-5 mr-2" />
            {t("dialogs.deleteLessonConfirmationTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("dialogs.deleteLessonConfirmationBody", { title: lesson.title })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {t("buttons.cancel")}
          </Button>
          <Button variant="destructive" onClick={handleDeleteConfirmed} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("buttons.deleting")}
              </>
            ) : (
              t("buttons.deleteLesson")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};