import { termsSections } from "@/data/legalData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Terms & Conditions | Pet Care Management",
  description: "Read the terms and conditions for using the Pet Care Management platform.",
};

export default function TermsPage() {
  return (
    <section aria-labelledby="terms-heading" className="min-h-screen bg-background pb-20 pt-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 text-center">
          <h1
            id="terms-heading"
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
          >
            Terms & Conditions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="space-y-6">
          {termsSections.map((section) => {
            const Icon = section.icon;
            
            return (
              <Card key={section.title} className="border border-border/50 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-muted-foreground">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}