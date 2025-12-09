// components/admin/ConfirmDialog.tsx
"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
};

export default function ConfirmDialog({ open, onClose, onConfirm, title = "Are you sure?", description }: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-2">{description}</div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={() => { onConfirm(); onClose(); }}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
