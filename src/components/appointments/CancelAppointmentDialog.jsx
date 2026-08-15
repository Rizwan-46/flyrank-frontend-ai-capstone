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
import { formatDate } from "@/utils/dateUtils";

export default function CancelAppointmentDialog({
  open,
  onOpenChange,
  appointment,
  onConfirm,
}) {
  if (!appointment) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]" data-testid="cancel-appointment-dialog">
        <AlertDialogHeader className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
          </div>
          <div>
            <AlertDialogTitle className="text-lg font-semibold">
              Cancel this appointment?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-sm leading-relaxed">
              The <span className="font-semibold text-foreground">&quot;{appointment.reason}&quot;</span> appointment on{" "}
              {formatDate(appointment.date)} at {appointment.time} will be
              marked as cancelled. It will remain in your appointment history.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 sm:mt-4">
          <AlertDialogCancel data-testid="dismiss-cancel-btn">Keep Appointment</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            data-testid="confirm-cancel-btn"
          >
            Cancel Appointment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}