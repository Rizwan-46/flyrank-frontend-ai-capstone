import Link from "next/link";
import { CalendarClock } from "lucide-react";
import EmptyState from "./EmptyState";
import { formatDate } from "@/utils/dateUtils";

export default function UpcomingAppointments({ appointments, petsById }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">
        Upcoming Appointments
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Your next scheduled vet visits.
      </p>

      <div className="mt-4">
        {appointments.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No upcoming appointments"
            description="Nothing scheduled right now."
          />
        ) : (
          <ul className="divide-y divide-border">
            {appointments.map((appt) => (
              <li key={appt.id}>
                <Link
                  href={`/dashboard/pets/${appt.petId}`}
                  className="flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {appt.reason}{" "}
                      <span className="text-muted-foreground">
                        — {petsById[appt.petId]?.name ?? "Unknown pet"}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(appt.date)} at {appt.time} · {appt.veterinarian}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}