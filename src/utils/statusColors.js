// src/utils/statusColors.js

/**
 * Status color mappings for vaccination status badges/UI.
 * Status is always calculated from dates — never stored directly.
 * See: src/utils/vaccinationStatus.js (or equivalent) for calculation logic.
 */

export const VACCINATION_STATUS = {
  UPCOMING: "UPCOMING",
  DUE_TODAY: "DUE_TODAY",
  OVERDUE: "OVERDUE",
  COMPLETED: "COMPLETED",
};

export const STATUS_COLORS = {
  UPCOMING: {
    badge: "bg-sky-100 text-sky-700 border border-sky-200",
    dot: "bg-sky-500",
    text: "text-sky-700",
  },
  DUE_TODAY: {
    badge: "bg-amber-100 text-amber-800 border border-amber-200",
    dot: "bg-amber-500",
    text: "text-amber-800",
  },
  OVERDUE: {
    badge: "bg-red-100 text-red-700 border border-red-200",
    dot: "bg-red-500",
    text: "text-red-700",
  },
  COMPLETED: {
    badge: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
  },
};

export const STATUS_LABELS = {
  UPCOMING: "Upcoming",
  DUE_TODAY: "Due Today",
  OVERDUE: "Overdue",
  COMPLETED: "Completed",
};

/**
 * Returns the Tailwind classes for a given status.
 * @param {string} status - one of VACCINATION_STATUS values
 * @param {"badge"|"dot"|"text"} variant - which style variant to return
 */
export function getStatusColor(status, variant = "badge") {
  return STATUS_COLORS[status]?.[variant] ?? STATUS_COLORS.UPCOMING[variant];
}

/**
 * Returns the human-readable label for a given status.
 * @param {string} status - one of VACCINATION_STATUS values
 */
export function getStatusLabel(status) {
  return STATUS_LABELS[status] ?? status;
}