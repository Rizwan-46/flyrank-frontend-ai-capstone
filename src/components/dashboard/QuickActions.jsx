import Link from "next/link";
import { PawPrint, CalendarCheck, ClipboardList } from "lucide-react";

const actions = [
  { href: "/dashboard/pets", label: "View Pets", icon: PawPrint },
  { href: "/dashboard/appointments", label: "View Appointments", icon: CalendarCheck },
  { href: "/dashboard/medical-records", label: "View Medical Records", icon: ClipboardList },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {actions.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}