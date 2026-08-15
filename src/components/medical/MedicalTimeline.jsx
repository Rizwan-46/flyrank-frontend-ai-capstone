import { Pencil, Trash2, Stethoscope, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/dateUtils";
import EmptyState from "@/components/dashboard/EmptyState";

export default function MedicalTimeline({
  records,
  petsById = {},
  showPetName = false,
  emptyTitle,
  emptyDescription,
  onEdit,
  onDelete,
}) {
  if (records.length === 0) {
    return (
      <div data-testid="empty-medical-records">
        <EmptyState
          icon={Stethoscope}
          title={emptyTitle ?? "No medical records yet"}
          description={
            emptyDescription ?? "Add a record to start building this history."
          }
        />
      </div>
    );
  }

  return (
    <ol className="relative space-y-8 border-l-2 border-primary/20 pl-6 sm:pl-8" data-testid="medical-timeline">
      {records.map((record) => (
        <li key={record.id} className="relative group" data-testid={`timeline-item-${record.id}`}>
          
          <span
            aria-hidden="true"
            className="absolute -left-[2.1rem] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-primary ring-4 ring-background transition-transform group-hover:scale-125 sm:-left-[2.6rem]"
          />

          <div className="rounded-3xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-md sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <time className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {formatDate(record.date)}
                  {showPetName && petsById[record.petId] && (
                    <span className="text-muted-foreground"> · {petsById[record.petId].name}</span>
                  )}
                </time>
                <h3 className="mt-1.5 text-xl font-bold text-foreground">
                  {record.reason}
                </h3>
              </div>
              
              <div className="flex shrink-0 gap-2 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => onEdit(record)}
                  className="bg-secondary/50 hover:bg-secondary"
                  data-testid={`edit-btn-${record.id}`}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onDelete(record)}
                  data-testid={`delete-btn-${record.id}`}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  Delete
                </Button>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 rounded-2xl bg-muted/30 p-4 text-sm sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" /> Diagnosis
                </dt>
                <dd className="font-medium text-foreground">{record.diagnosis}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" /> Treatment
                </dt>
                <dd className="font-medium text-foreground">{record.treatment}</dd>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <User className="h-3.5 w-3.5" aria-hidden="true" /> Veterinarian
                </dt>
                <dd className="font-medium text-foreground">{record.veterinarian}</dd>
              </div>
            </dl>

            {record.notes && (
              <div className="mt-5 border-t border-border/50 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Notes
                </p>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
                  {record.notes}
                </p>
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}