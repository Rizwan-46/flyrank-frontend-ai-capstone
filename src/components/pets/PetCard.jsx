import Link from "next/link";
import { Pencil, Trash2, PawPrint, Weight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/dateUtils";

export default function PetCard({ pet, onEdit, onDelete }) {
  return (
    <div className="group flex flex-col justify-between rounded-3xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
      
      {/* Top Section (Clickable) */}
      <Link href={`/dashboard/pets/${pet.id}`} className="block flex-1">
        
        {/* Header: Avatar + Info */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
              <PawPrint className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                {pet.name}
              </h3>
              <p className="truncate text-sm font-medium text-muted-foreground">
                {pet.breed} • {pet.species}
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold tracking-wide text-secondary-foreground">
            {pet.gender}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-muted/30 p-4">
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" /> Born
            </span>
            <span className="text-sm font-semibold text-foreground">
              {formatDate(pet.dateOfBirth)}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Weight className="h-3.5 w-3.5" aria-hidden="true" /> Weight
            </span>
            <span className="text-sm font-semibold text-foreground">
              {pet.weight} kg
            </span>
          </div>
        </div>

        {/* Allergies */}
        {pet.allergies && pet.allergies.length > 0 && (
          <div className="mt-5">
            <h4 className="mb-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Allergies
            </h4>
            <div className="flex flex-wrap gap-2">
              {pet.allergies.map((allergy) => (
                <span
                  key={allergy}
                  className="inline-flex items-center rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive ring-1 ring-inset ring-destructive/20"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}
      </Link>

      {/* Bottom Actions (Outside the Link to prevent routing conflicts) */}
      <div className="mt-6 flex gap-3 border-t border-border/50 pt-4 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 bg-secondary/50 hover:bg-secondary"
          onClick={() => onEdit(pet)}
        >
          <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(pet)}
        >
          <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
          Delete
        </Button>
      </div>
      
    </div>
  );
}