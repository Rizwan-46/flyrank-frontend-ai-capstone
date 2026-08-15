import { Pencil, Trash2, CheckCircle2, Calendar, CalendarClock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStatusColor, getStatusLabel } from "@/utils/statusColors";
import {
  getVaccinationStatus,
  getVaccinationReminderLabel,
} from "@/utils/vaccinationStatus";
import { formatDate } from "@/utils/dateUtils";
import { VACCINATION_STATUS } from "@/utils/statusColors";

export default function VaccinationListItem({
  vaccination,
  petName,
  showPetName = false,
  highlighted = false,
  onEdit,
  onDelete,
  onComplete,
}) {
  const status = getVaccinationStatus(vaccination);
  const isCompleted = status === VACCINATION_STATUS.COMPLETED;

  return (
    <div
      id={`vaccination-${vaccination.id}`}
      data-testid={`vaccination-item-${vaccination.id}`}
      className={`group scroll-mt-24 rounded-3xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-7 ${
        highlighted
          ? "border-primary ring-2 ring-primary/40"
          : "border-border/50 hover:border-primary/30"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-bold text-foreground">
              {vaccination.name}
            </h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${getStatusColor(
                status,
                "badge"
              )}`}
              data-testid={`status-badge-${vaccination.id}`}
            >
              {getStatusLabel(status)}
            </span>
          </div>
          <p className="mt-1.5 text-sm font-medium text-muted-foreground">
            {getVaccinationReminderLabel(vaccination)}
            {showPetName && petName ? ` · ${petName}` : ""}
          </p>
        </div>

        {/* Action Buttons (Hidden on desktop until hover) */}
        <div className="flex shrink-0 flex-wrap gap-2 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
          {!isCompleted && (
            <Button 
              size="sm" 
              onClick={() => onComplete(vaccination)}
              className="bg-primary/90 hover:bg-primary"
              data-testid={`complete-btn-${vaccination.id}`}
            >
              <CheckCircle2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Complete
            </Button>
          )}
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => onEdit(vaccination)}
            className="bg-secondary/50 hover:bg-secondary"
            data-testid={`edit-btn-${vaccination.id}`}
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(vaccination)}
            data-testid={`delete-btn-${vaccination.id}`}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </div>

      {/* Card-in-Card Details */}
      <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 rounded-2xl bg-muted/30 p-4 text-sm sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" /> Administered
          </dt>
          <dd className="font-medium text-foreground">{formatDate(vaccination.administeredDate)}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" /> Next Due
          </dt>
          <dd className="font-medium text-foreground">{formatDate(vaccination.nextDueDate)}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <User className="h-3.5 w-3.5" aria-hidden="true" /> Veterinarian
          </dt>
          <dd className="font-medium text-foreground">{vaccination.veterinarian}</dd>
        </div>
      </dl>

      {vaccination.notes && (
        <div className="mt-5 border-t border-border/50 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Notes
          </p>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
            {vaccination.notes}
          </p>
        </div>
      )}
    </div>
  );
}