import { featuresData } from "@/data/featuresData";

export default function Features() {
  return (
    <section
      aria-labelledby="features-heading"
      className="bg-background py-20 sm:py-32"
      data-testid="features-section"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="features-heading"
            className="text-sm font-semibold tracking-wide text-primary uppercase"
          >
            Powerful Features
          </h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Everything you need to manage pet care
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Built for pet owners who want clarity, not clutter. Access all your records from a single, beautifully designed dashboard.
          </p>
        </div>

        {/* Semantic List Grid */}
        <ul 
          role="list"
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          data-testid="features-grid"
        >
          {featuresData.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </ul>
        
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }) {
  const { icon: Icon, title, description } = feature;
  
  return (
    <li 
      className="group rounded-3xl border border-border/50 bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
      data-testid={`feature-card-${index}`}
    >
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
        <Icon className="h-7 w-7 text-primary" strokeWidth={2} aria-hidden="true" />
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        {description}
      </p>
    </li>
  );
}