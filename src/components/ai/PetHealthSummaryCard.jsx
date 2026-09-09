import {
  PawPrint,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CalendarClock,
  Stethoscope,
  Activity,
} from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import Link from "next/link";

export default function PetHealthSummaryCard({ result }) {
  if (!result) return null;

  if (result.notFound) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-6 text-center shadow-sm">
        <div className="mb-3 rounded-full bg-muted p-3">
          <PawPrint className="h-6 w-6 text-muted-foreground opacity-50" aria-hidden="true" />
        </div>
        <p className="text-sm text-muted-foreground">
          {result.message || "That pet couldn't be found."}
        </p>
        <Link
          href="/dashboard/pets"
          className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          View my pets
        </Link>
      </div>
    );
  }

  const { pet, healthStatus, vaccinations, upcomingAppointment, recentMedicalRecords } = result;
  const needsAttention = healthStatus === "needs-attention";

  return (
    <div className="group relative w-full max-w-sm overflow-hidden rounded-3xl border border-border/60 bg-card p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl sm:max-w-md">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap sm:gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner ring-1 ring-primary/10 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
            <PawPrint className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0">
         <h2 className="truncate text-base font-bold text-foreground">{pet.name}</h2>
            <p className="truncate text-xs font-medium text-muted-foreground">
              {pet.breed} · {pet.species}
            </p>
          </div>
        </div>

        <span
          className={`flex shrink-0 items-center gap-1.5 self-start rounded-full border px-3 py-1 text-xs font-semibold shadow-sm transition-colors sm:self-auto ${
            needsAttention
              ? "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {needsAttention ? (
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          ) : (
            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
          )}
          {needsAttention ? "Needs Attention" : "Good"}
        </span>
      </div>

      <div className="relative mt-6">
        <div className="mb-2 flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-primary/70" aria-hidden="true" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Vaccination Status
          </h4>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          <VaxStat icon={CheckCircle2} label="Completed" value={vaccinations.completed} tone="emerald" />
          <VaxStat icon={AlertTriangle} label="Overdue" value={vaccinations.overdue} tone="red" />
          <VaxStat icon={Clock} label="Upcoming" value={vaccinations.upcoming} tone="sky" />
        </div>
      </div>

      <div className="relative mt-5 rounded-2xl border border-border/50 bg-muted/40 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />
          Next Appointment
        </div>
        {upcomingAppointment ? (
          <div className="mt-2 rounded-xl bg-background p-3 shadow-sm ring-1 ring-border/50 transition-colors hover:border-primary/30">
            <p className="text-sm font-medium text-foreground">
              {formatDate(upcomingAppointment.date)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {upcomingAppointment.reason}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            No upcoming appointment scheduled.
          </p>
        )}
      </div>

      {recentMedicalRecords?.length > 0 && (
        <div className="relative mt-4 rounded-2xl border border-border/50 bg-muted/40 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Stethoscope className="h-4 w-4 text-primary" aria-hidden="true" />
            Recent Medical Records
          </div>
          <ul className="relative mt-3 space-y-3 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-border">
            {recentMedicalRecords.map((r, i) => (
              <li key={i} className="relative flex gap-3 pl-1.5">
                <div className="relative z-10 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-background ring-2 ring-muted">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {formatDate(r.date)}
                  </p>
                  <p className="mt-0.5 text-sm leading-snug text-foreground">{r.diagnosis}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const TONE_STYLES = {
  emerald: {
    wrapper:
      "bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40",
    iconBox: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  red: {
    wrapper:
      "bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20 hover:border-red-500/40",
    iconBox: "bg-red-500/10 text-red-600 dark:text-red-400",
    text: "text-red-700 dark:text-red-400",
  },
  sky: {
    wrapper:
      "bg-gradient-to-br from-sky-500/10 to-sky-500/5 border-sky-500/20 hover:border-sky-500/40",
    iconBox: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    text: "text-sky-700 dark:text-sky-400",
  },
};

function VaxStat({ icon: Icon, label, value, tone }) {
  const styles = TONE_STYLES[tone];

  return (
    <div
      className={`group/stat flex items-center justify-between rounded-2xl border px-4 py-3 shadow-sm transition-all sm:flex-col sm:items-start sm:justify-center sm:gap-3 sm:p-3 ${styles.wrapper}`}
    >
      <div className="flex items-center gap-2 sm:w-full sm:justify-between">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform group-hover/stat:scale-110 ${styles.iconBox}`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <p className={`text-2xl font-bold tracking-tight ${styles.text}`}>{value}</p>
      </div>
      <p
        className={`text-sm font-semibold sm:text-[0.65rem] sm:uppercase sm:tracking-wider ${styles.text} opacity-80`}
      >
        {label}
      </p>
    </div>
  );
}