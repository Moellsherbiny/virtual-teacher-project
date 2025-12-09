"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      {/* 
        IMPORTANT:
        Wrapping with a button-like div that Radix fully understands.
        This version works inside DropdownMenuItem.
      */}
      <AlertDialogTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className="w-full"
          onClick={(e) => {
            e.preventDefault(); // prevent dropdown auto-close
            e.stopPropagation(); // allow dialog to open
          }}
        >
          {trigger}
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
