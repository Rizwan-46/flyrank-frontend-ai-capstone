import Link from "next/link";
import { CalendarClock } from "lucide-react";
import EmptyState from "./EmptyState";
import { formatDate } from "@/utils/dateUtils";

export default function UpcomingAppointments({ appointments, petsById }) {
  return (
    <section 
      className="flex flex-col rounded-3xl border border-border/50 bg-card p-6 shadow-sm sm:p-8"
      data-testid="upcoming-appointments-widget"
    >
      <header>
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Upcoming Appointments
        </h2>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Your next scheduled vet visits.
        </p>
      </header>

      <div className="mt-6 flex-1">
        {appointments.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No upcoming appointments"
            description="Nothing scheduled right now."
          />
        ) : (
          <ul className="space-y-2">
            {appointments.map((appt) => (
              <li key={appt.id}>
                <Link
                  href={`/dashboard/pets/${appt.petId}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-transparent px-4 py-3 transition-all duration-200 hover:border-border/50 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  data-testid={`appointment-row-${appt.id}`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {appt.reason}{" "}
                      <span className="font-medium text-muted-foreground group-hover:text-foreground/70">
                        — {petsById[appt.petId]?.name ?? "Unknown pet"}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                      {formatDate(appt.date)} at {appt.time} · {appt.veterinarian}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}