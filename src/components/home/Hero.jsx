"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroVisual from "./HeroVisual";
import { useAuthStore } from "@/store/authStore";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pb-12 pt-4 sm:pb-16 sm:pt-8 lg:pb-20 lg:pt-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 left-1/2 top-0 h-72 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-[90px]"
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
        <div className="order-1 relative flex items-center justify-center lg:order-2">
          <HeroVisual />
        </div>

        <div className="order-2 flex flex-col items-start lg:order-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
            <Sparkles
              className="h-3.5 w-3.5 motion-safe:animate-spin motion-safe:[animation-duration:6s]"
              aria-hidden="true"
            />
            <span>AI-Powered Health Assistant</span>
          </div>

          <h1
            id="hero-heading"
            className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Every detail of your pet&apos;s care,{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              in one place
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Pet Care Management keeps vaccinations, medical history, and appointments
            organized and easy to track — so nothing important ever slips through the cracks.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {!hasHydrated ? (
              <div className="flex gap-4">
                <Button size="lg" disabled className="w-[164px]">
                  <span className="opacity-0">Loading...</span>
                </Button>
                <Button size="lg" variant="outline" disabled className="w-[88px]">
                  <span className="opacity-0">Wait</span>
                </Button>
              </div>
            ) : isAuthenticated ? (
              <Button
                size="lg"
                data-testid="hero-dashboard-btn"
                nativeButton={false}
                render={<Link href="/dashboard" />}
                className="group relative shadow-md shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/30"
              >
                Go to Dashboard
                <ArrowRight
                  className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  data-testid="hero-signup-btn"
                  nativeButton={false}
                  render={<Link href="/signup" />}
                  className="group relative shadow-md shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/30"
                >
                  Get Started Free
                  <ArrowRight
                    className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  data-testid="hero-login-btn"
                  nativeButton={false}
                  render={<Link href="/login" />}
                  className="transition-all duration-300 hover:-translate-y-0.5 hover:bg-muted/70"
                >
                  Log In
                </Button>
              </>
            )}
          </div>

          <div className="mt-8 flex w-full items-center justify-center gap-3 border-t border-border/50 pt-5 text-xs text-muted-foreground sm:gap-6">
            <div>
              <p className="text-base font-bold text-foreground">100%</p>
              <p>Free for pet parents</p>
            </div>
            <div className="h-6 w-[1px] bg-border" aria-hidden="true" />
            <div>
              <p className="text-base font-bold text-foreground">Instant</p>
              <p>AI health triage</p>
            </div>
            <div className="h-6 w-[1px] bg-border" aria-hidden="true" />
            <div>
              <p className="text-base font-bold text-foreground">Zero</p>
              <p>Missed vaccines</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}