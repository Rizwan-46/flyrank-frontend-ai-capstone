import { Syringe } from "lucide-react";
import EmptyState from "./EmptyState";
import VaccinationRow from "./VaccinationRow";

export default function VaccinationReminders({ items, petsById }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">
        Vaccination Reminders
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Upcoming and due-today vaccinations.
      </p>

      <div className="mt-4">
        {items.length === 0 ? (
          <EmptyState
            icon={Syringe}
            title="No upcoming vaccinations"
            description="You're all caught up for now."
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