"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroVisual from "./HeroVisual";
import { useAuthStore } from "@/store/authStore";

export default function Hero() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden py-16 sm:py-24"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2">
        <div>
          <h1
            id="hero-heading"
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Every detail of your pet&apos;s care,{" "}
            <span className="text-primary">in one place</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Pet Care Management keeps vaccinations, medical history, and appointments
            organized and easy to track — so nothing important ever slips
            through the cracks.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
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
                render={<Link href="/dashboard" />}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  data-testid="hero-signup-btn"
                  render={<Link href="/signup" />}
                >
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  data-testid="hero-login-btn"
                  render={<Link href="/login" />}
                >
                  Log In
                </Button>
              </>
            )}
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}