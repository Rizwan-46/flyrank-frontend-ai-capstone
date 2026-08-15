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

export default function DeletePetDialog({
  open,
  onOpenChange,
  pet,
  relatedCounts,
  onConfirm,
}) {
  if (!pet) return null;

  const { vaccinations, medicalRecords, appointments } = relatedCounts;
  const hasRelatedRecords = vaccinations > 0 || medicalRecords > 0 || appointments > 0;

  const parts = [];
  if (vaccinations > 0) {
    parts.push(`${vaccinations} vaccination record${vaccinations === 1 ? "" : "s"}`);
  }
  if (medicalRecords > 0) {
    parts.push(`${medicalRecords} medical record${medicalRecords === 1 ? "" : "s"}`);
  }
  if (appointments > 0) {
    parts.push(`${appointments} appointment${appointments === 1 ? "" : "s"}`);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {pet.name}?</AlertDialogTitle>
          <AlertDialogDescription
            render={<div className="space-y-2 text-left" />}
          >
            <p>
              This action cannot be undone. {pet.name}&apos;s profile will
              be permanently removed.
            </p>
            {hasRelatedRecords && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-destructive">
                This will also permanently delete {parts.join(", ")}{" "}
                associated with this pet.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Pet
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}