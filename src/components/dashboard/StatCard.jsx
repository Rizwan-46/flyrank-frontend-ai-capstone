export default function StatCard({ icon: Icon, label, value }) {
  return (
    <div 
      className="group rounded-3xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
      data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
          <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}