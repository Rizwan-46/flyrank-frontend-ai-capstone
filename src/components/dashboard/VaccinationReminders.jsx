import { Syringe } from "lucide-react";
import EmptyState from "./EmptyState";
import VaccinationRow from "./VaccinationRow";

export default function VaccinationReminders({ items, petsById }) {
  return (
    <section 
      className="flex flex-col rounded-3xl border border-border/50 bg-card p-6 shadow-sm sm:p-8"
      data-testid="vaccination-reminders-widget"
    >
      <header>
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Vaccination Reminders
        </h2>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Upcoming and due-today vaccinations.
        </p>
      </header>

      <div className="mt-6 flex-1">
        {items.length === 0 ? (
          <EmptyState
            icon={Syringe}
            title="No upcoming vaccinations"
            description="You're all caught up for now."
          />
        ) : (
          <ul className="space-y-2">
            {items.map((v) => (
              <li key={v.id}>
                <VaccinationRow
                  vaccination={v}
                  petName={petsById[v.petId]?.name ?? "Unknown pet"}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}