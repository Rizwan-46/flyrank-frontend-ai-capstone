import { parseDateOnly, getTodayDateOnly, daysBetween } from "./dateUtils";
import { VACCINATION_STATUS } from "./statusColors";

/**
 * Status is ALWAYS derived from dates — never stored as a field.
 */
export function getVaccinationStatus(vaccination) {
  if (vaccination.completed) return VACCINATION_STATUS.COMPLETED;

  const today = getTodayDateOnly();
  const dueDate = parseDateOnly(vaccination.nextDueDate);
  const diff = daysBetween(today, dueDate);

  if (diff < 0) return VACCINATION_STATUS.OVERDUE;
  if (diff === 0) return VACCINATION_STATUS.DUE_TODAY;
  return VACCINATION_STATUS.UPCOMING;
}

export function getDaysOverdue(vaccination) {
  const today = getTodayDateOnly();
  const dueDate = parseDateOnly(vaccination.nextDueDate);
  const diff = daysBetween(dueDate, today);
  return diff > 0 ? diff : 0;
}

export function getDaysUntilDue(vaccination) {
  const today = getTodayDateOnly();
  const dueDate = parseDateOnly(vaccination.nextDueDate);
  const diff = daysBetween(today, dueDate);
  return diff > 0 ? diff : 0;
}

export function getVaccinationReminderLabel(vaccination) {
  const status = getVaccinationStatus(vaccination);

  if (status === VACCINATION_STATUS.OVERDUE) {
    const days = getDaysOverdue(vaccination);
    return `Overdue by ${days} day${days === 1 ? "" : "s"}`;
  }
  if (status === VACCINATION_STATUS.DUE_TODAY) return "Due today";
  if (status === VACCINATION_STATUS.UPCOMING) {
    const days = getDaysUntilDue(vaccination);
    return `Due in ${days} day${days === 1 ? "" : "s"}`;
  }
  return "Completed";
}