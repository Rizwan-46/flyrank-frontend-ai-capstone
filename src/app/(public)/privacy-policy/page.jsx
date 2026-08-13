import { privacyPolicies } from "@/data/legalData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy | Pet Care Management",
  description: "Learn how Pet Care Management collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <section aria-labelledby="privacy-heading" className="min-h-screen bg-background pb-20 pt-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 text-center">
          <h1
            id="privacy-heading"
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
          >
            Privacy Policy
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We are committed to protecting your privacy and your pets&apos; sensitive data.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {privacyPolicies.map((policy) => {
            const Icon = policy.icon;
            
            return (
              <Card key={policy.title} className="border border-border/50 shadow-sm transition-all hover:shadow-md">
                <CardHeader className="flex flex-col items-start gap-4 pb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{policy.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-muted-foreground">
                    {policy.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 rounded-lg border border-border/50 bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            If you have any questions regarding this privacy policy or wish to request the deletion of your account and associated data, please navigate to our <a href="/contact" className="text-primary hover:underline">Contact</a> page.
          </p>
        </div>

      </div>
    </section>
  );
}