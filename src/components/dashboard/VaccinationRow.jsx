import Link from "next/link";
import { getStatusColor, getStatusLabel } from "@/utils/statusColors";
import {
  getVaccinationStatus,
  getVaccinationReminderLabel,
} from "@/utils/vaccinationStatus";

export default function VaccinationRow({ vaccination, petName }) {
  const status = getVaccinationStatus(vaccination);

  return (
    <Link
      href={`/dashboard/pets/${vaccination.petId}`}
      className="flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {vaccination.name}{" "}
          <span className="text-muted-foreground">— {petName}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {getVaccinationReminderLabel(vaccination)}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(
          status,
          "badge"
        )}`}
      >
        {getStatusLabel(status)}
      </span>
    </Link>
  );
}