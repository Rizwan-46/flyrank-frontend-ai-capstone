import { parseDateOnly, getTodayDateOnly } from "./dateUtils";

export const APPOINTMENT_STATUS_COLORS = {
  scheduled: "bg-sky-100 text-sky-700 border border-sky-200",
  completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  cancelled: "bg-muted text-muted-foreground border border-border",
};

export const APPOINTMENT_STATUS_LABELS = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function isAppointmentUpcoming(appointment) {
  const today = getTodayDateOnly();
  return (
    appointment.status === "scheduled" &&
    parseDateOnly(appointment.date) >= today
  );
}

export function isAppointmentPast(appointment) {
  return !isAppointmentUpcoming(appointment);
}