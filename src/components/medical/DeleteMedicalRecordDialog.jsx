"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

export default function DeleteMedicalRecordDialog({
  open,
  onOpenChange,
  record,
  onConfirm,
}) {
  if (!record) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]" data-testid="delete-record-dialog">
        <AlertDialogHeader className="flex flex-col items-center gap-2 text-center sm:text-left sm:items-start sm:flex-row sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
          </div>
          <div>
            <AlertDialogTitle className="text-lg font-semibold">
              Delete medical record?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-sm leading-relaxed">
              This will permanently remove the <span className="font-semibold text-foreground">&quot;{record.reason}&quot;</span> record
              from {record.date}. This action cannot be undone.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 sm:mt-4">
          <AlertDialogCancel data-testid="cancel-delete-btn">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            data-testid="confirm-delete-btn"
          >
            Delete Record
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}