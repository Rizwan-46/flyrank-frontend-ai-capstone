import Link from "next/link";
import { Stethoscope } from "lucide-react";
import EmptyState from "./EmptyState";
import { formatDate } from "@/utils/dateUtils";

export default function RecentMedicalRecords({ records, petsById }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">
        Recent Medical Records
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Latest visits across all your pets.
      </p>

      <div className="mt-4">
        {records.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title="No medical records yet"
            description="Visit history will appear here."
          />
        ) : (
          <ul className="divide-y divide-border">
            {records.map((record) => (
              <li key={record.id}>
                <Link
                  href={`/dashboard/pets/${record.petId}?tab=medical&highlight=${record.id}`}
                  className="flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {record.reason}{" "}
                      <span className="text-muted-foreground">
                        — {petsById[record.petId]?.name ?? "Unknown pet"}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(record.date)} · {record.diagnosis}
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