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
      className="relative overflow-hidden pt-4 pb-12 sm:pt-8 sm:pb-16 lg:pt-10 lg:pb-20"
    >
      {/* Background ambient light */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-[90px]" 
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
        
        {/* Visual column: Order 1 on mobile, Order 2 on desktop */}
        <div className="order-1 relative flex items-center justify-center lg:order-2">
          <HeroVisual />
        </div>

        {/* Content column: Order 2 on mobile, Order 1 on desktop */}
        <div className="order-2 flex flex-col items-start lg:order-1">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 animate-spin [animation-duration:6s]" />
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

          {/* Action Buttons */}
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
                className="group relative shadow-md shadow-primary/20 transition-all duration-300 hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  data-testid="hero-signup-btn"
                  nativeButton={false}
                  render={<Link href="/signup" />}
                  className="group relative shadow-md shadow-primary/20 transition-all duration-300 hover:shadow-primary/30 hover:-translate-y-0.5"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  data-testid="hero-login-btn"
                  nativeButton={false}
                  render={<Link href="/login" />}
                  className="transition-all duration-300 hover:bg-muted/70 hover:-translate-y-0.5"
                >
                  Log In
                </Button>
              </>
            )}
          </div>

          {/* Trust Metric Preview */}
          <div className="mt-8 w-full flex items-center  justify-center gap-6 border-t border-border/50 pt-5 text-xs text-muted-foreground">
            <div>
              <p className="text-base font-bold text-foreground">100%</p>
              <p>Free for pet parents</p>
            </div>
            <div className="h-6 w-[1px] bg-border" />
            <div>
              <p className="text-base font-bold text-foreground">Instant</p>
              <p>AI health triage</p>
            </div>
            <div className="h-6 w-[1px] bg-border" />
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