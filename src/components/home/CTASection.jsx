import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section aria-labelledby="cta-heading" className="bg-primary py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2
          id="cta-heading"
          className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl"
        >
          Ready to get organized?
        </h2>
        <p className="mt-4 text-primary-foreground/80">
          Create a free demo account and start managing your pets&apos; care today.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" variant="secondary">
            <Link href="/signup">Create Free Account</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}