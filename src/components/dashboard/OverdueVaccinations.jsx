import { AlertTriangle } from "lucide-react";
import EmptyState from "./EmptyState";
import VaccinationRow from "./VaccinationRow";

export default function OverdueVaccinations({ items, petsById }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">
        Overdue Vaccinations
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        These need attention as soon as possible.
      </p>

      <div className="mt-4">
        {items.length === 0 ? (
          <EmptyState
            icon={AlertTriangle}
            title="No overdue vaccinations"
            description="Great job staying on schedule."
          />
        ) : (
          <div className="divide-y divide-border">
            {items.map((v) => (
              <VaccinationRow
                key={v.id}
                vaccination={v}
                petName={petsById[v.petId]?.name ?? "Unknown pet"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}