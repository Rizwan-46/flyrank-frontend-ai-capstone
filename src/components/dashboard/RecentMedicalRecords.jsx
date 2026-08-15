import Link from "next/link";
import { Stethoscope } from "lucide-react";
import EmptyState from "./EmptyState";
import { formatDate } from "@/utils/dateUtils";

export default function RecentMedicalRecords({ records, petsById }) {
  return (
    <section 
      className="flex flex-col rounded-3xl border border-border/50 bg-card p-6 shadow-sm sm:p-8"
      data-testid="recent-medical-records-widget"
    >
      <header>
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Recent Medical Records
        </h2>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Latest visits across all your pets.
        </p>
      </header>

      <div className="mt-6 flex-1">
        {records.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title="No medical records yet"
            description="Visit history will appear here."
          />
        ) : (
          <ul className="space-y-2">
            {records.map((record) => (
              <li key={record.id}>
                <Link
                  href={`/dashboard/pets/${record.petId}?tab=medical&highlight=${record.id}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-transparent px-4 py-3 transition-all duration-200 hover:border-border/50 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  data-testid={`medical-record-row-${record.id}`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {record.reason}{" "}
                      <span className="font-medium text-muted-foreground group-hover:text-foreground/70">
                        — {petsById[record.petId]?.name ?? "Unknown pet"}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                      {formatDate(record.date)} · {record.diagnosis}
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