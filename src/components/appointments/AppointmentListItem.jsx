import { Pencil, XCircle, CalendarClock, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/dateUtils";
import {
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
} from "@/utils/appointmentUtils";

export default function AppointmentListItem({
  appointment,
  petName,
  onEdit,
  onCancel,
  showPetName,
}) {
  const canModify = appointment.status === "scheduled";

  return (
    <div 
      className="group rounded-3xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md sm:p-7"
      data-testid={`appointment-item-${appointment.id}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-bold text-foreground">
              {appointment.reason}
            </h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
                APPOINTMENT_STATUS_COLORS[appointment.status]
              }`}
              data-testid={`status-badge-${appointment.id}`}
            >
              {APPOINTMENT_STATUS_LABELS[appointment.status]}
            </span>
          </div>
          <p className="mt-1.5 text-sm font-medium text-muted-foreground">
            {formatDate(appointment.date)} at {appointment.time}
            {showPetName && petName ? ` · ${petName}` : ""}
          </p>
        </div>

        {/* Action Buttons (Hidden on desktop until hover) */}
        {canModify && (
          <div className="flex shrink-0 flex-wrap gap-2 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => onEdit(appointment)}
              className="bg-secondary/50 hover:bg-secondary"
              data-testid={`edit-btn-${appointment.id}`}
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onCancel(appointment)}
              data-testid={`cancel-btn-${appointment.id}`}
            >
              <XCircle className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Card-in-Card Details */}
      <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 rounded-2xl bg-muted/30 p-4 text-sm sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Time
          </dt>
          <dd className="font-medium text-foreground">{appointment.time}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <User className="h-3.5 w-3.5" aria-hidden="true" /> Veterinarian
          </dt>
          <dd className="font-medium text-foreground">{appointment.veterinarian}</dd>
        </div>
      </dl>

      {appointment.notes && (
        <div className="mt-5 border-t border-border/50 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Notes
          </p>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
            {appointment.notes}
          </p>
        </div>
      )}
    </div>
  );
}