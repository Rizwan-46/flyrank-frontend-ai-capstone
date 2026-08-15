import Link from "next/link";
import { PawPrint, CalendarCheck, ClipboardList } from "lucide-react";

const actions = [
  { href: "/dashboard/pets", label: "View Pets", icon: PawPrint },
  { href: "/dashboard/appointments", label: "View Appointments", icon: CalendarCheck },
  { href: "/dashboard/medical-records", label: "View Medical Records", icon: ClipboardList },
];

export default function QuickActions() {
  return (
    <section 
      className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm sm:p-8"
      data-testid="quick-actions-section"
    >
      <header>
        <h2 className="text-lg font-bold tracking-tight text-foreground">Quick Actions</h2>
      </header>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {actions.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-background p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            data-testid={`action-link-${label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <span className="text-sm font-semibold text-foreground group-hover:text-primary">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}