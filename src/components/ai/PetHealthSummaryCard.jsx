import { PawPrint, CheckCircle2, AlertTriangle, Clock, CalendarClock, Stethoscope } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import Link from "next/link";

export default function PetHealthSummaryCard({ result }) {
  if (!result) return null;

  if (result.notFound) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-4 text-sm text-muted-foreground">
        <p>{result.message || "That pet couldn't be found."}</p>
        <Link href="/dashboard/pets" className="mt-2 inline-block text-primary underline">
          View my pets
        </Link>
      </div>
    );
  }

  const { pet, healthStatus, vaccinations, upcomingAppointment, recentMedicalRecords } = result;
  const needsAttention = healthStatus === "needs-attention";

  return (
    <div className="group w-full max-w-sm rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md sm:max-w-md">
    <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap sm:gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary/15">
            <PawPrint className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">{pet.name}</h3>
            <p className="text-xs text-muted-foreground">
              {pet.breed} · {pet.species}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 self-start rounded-full px-2.5 py-1 text-xs font-medium transition-colors sm:self-auto ${
            needsAttention
              ? "border border-red-200 bg-red-100 text-red-700 hover:bg-red-200"
              : "border border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          }`}
        >
          {needsAttention ? "Needs Attention" : "Good"}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-muted-foreground">Vaccinations</p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          <VaxStat icon={CheckCircle2} label="Completed" value={vaccinations.completed} tone="emerald" />
          <VaxStat icon={AlertTriangle} label="Overdue" value={vaccinations.overdue} tone="red" />
          <VaxStat icon={Clock} label="Upcoming" value={vaccinations.upcoming} tone="sky" />
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
          Next Appointment
        </div>
        {upcomingAppointment ? (
          <p className="mt-1 rounded-md px-1.5 py-1 -ml-1.5 text-sm text-foreground transition-colors hover:bg-muted/40 cursor-default">
            {formatDate(upcomingAppointment.date)} · {upcomingAppointment.reason}
          </p>
        ) : (
          <p className="mt-1 px-1.5 py-1 -ml-1.5 text-sm text-muted-foreground">No upcoming appointment scheduled.</p>
        )}
      </div>

      {recentMedicalRecords?.length > 0 && (
        <div className="mt-4 border-t border-border pt-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" />
            Recent Medical Records
          </div>
          <ul className="mt-2 space-y-0.5">
            {recentMedicalRecords.map((r, i) => (
              <li key={i} className=" rounded-md px-1.5 py-1 -ml-1.5 text-sm text-foreground transition-colors hover:bg-muted/40 cursor-default">
                <span className="text-muted-foreground">{formatDate(r.date)} · </span>
                {r.diagnosis}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const TONE_CLASSES = {
  emerald: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
  red: "bg-red-100 text-red-700 hover:bg-red-200",
  sky: "bg-sky-100 text-sky-700 hover:bg-sky-200",
};

function VaxStat({ icon: Icon, label, value, tone }) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors sm:flex-col sm:justify-center sm:gap-2 sm:px-2 sm:py-4 ${TONE_CLASSES[tone]}`}
    >
      <div className="flex items-center gap-2 sm:flex-col sm:gap-1.5">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        <p className="text-sm font-semibold sm:text-[0.65rem] sm:uppercase sm:tracking-wider sm:opacity-90">
          {label}
        </p>
      </div>
      <p className="text-lg font-bold sm:text-2xl">{value}</p>
    </div>
  );
}