"use client";

import { useState } from "react";
import { PawPrint, HeartPulse, CalendarCheck, Syringe, CheckCircle2 } from "lucide-react";

export default function HeroVisual() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group/container relative flex h-72 w-full max-w-[300px] items-center justify-center sm:h-96 sm:max-w-md"
    >
      {/* Interactive cursor-follow spotlight — uses the real theme
          primary color directly (no undefined --primary-rgb fallback). */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover/container:opacity-100"
        style={{
          background: `radial-gradient(240px circle at ${mousePos.x}px ${mousePos.y}px, var(--primary), transparent 75%)`,
          opacity: 0,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover/container:opacity-[0.12]"
        style={{
          background: `radial-gradient(240px circle at ${mousePos.x}px ${mousePos.y}px, var(--primary), transparent 75%)`,
        }}
      />

      {/* Static rings — no continuous ambient motion. Middle ring still
          responds to hover (user-triggered), which is fine. */}
      <div
        aria-hidden="true"
        className="absolute h-64 w-64 rounded-full border border-primary/10 transition-all duration-700 group-hover/container:scale-105 group-hover/container:border-primary/25 sm:h-72 sm:w-72"
      />
      <div
        aria-hidden="true"
        className="absolute h-48 w-48 rounded-full border border-dashed border-primary/20 transition-all duration-700 group-hover/container:scale-105 group-hover/container:rotate-45 group-hover/container:border-primary/40 sm:h-56 sm:w-56"
      />
      <div
        aria-hidden="true"
        className="absolute h-36 w-36 rounded-full border border-primary/30 transition-all duration-700 group-hover/container:border-accent/40 sm:h-40 sm:w-40"
      />

      {/* Central core */}
      <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-primary via-primary/80 to-accent p-0.5 shadow-xl shadow-primary/25 transition-all duration-500 hover:scale-110 hover:rotate-12 hover:shadow-2xl hover:shadow-primary/40">
        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-background/90 backdrop-blur-md">
          <PawPrint
            className="h-8 w-8 text-primary transition-transform duration-300 hover:scale-110"
            strokeWidth={2.2}
            aria-hidden="true"
          />
          <span className="absolute -right-1 -top-1 flex h-4 w-4" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
              ✓
            </span>
          </span>
        </div>
      </div>

      <InteractiveFloatingCard
        icon={HeartPulse}
        label="Medical Record"
        badge="Updated"
        metric="All clear"
        className="left-0 top-2 sm:left-1 sm:top-2"
        delay="0ms"
        iconColor="text-rose-500"
        badgeColor="bg-rose-500/10 text-rose-500 border-rose-500/20"
        glowColor="hover:shadow-rose-500/25 hover:border-rose-500/50"
      />

      <InteractiveFloatingCard
        icon={CalendarCheck}
        label="Vet Checkup"
        badge="Confirmed"
        metric="Tomorrow, 10 AM"
        className="right-0 top-0 sm:right-1 sm:top-1"
        delay="90ms"
        iconColor="text-emerald-500"
        badgeColor="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
        glowColor="hover:shadow-emerald-500/25 hover:border-emerald-500/50"
      />

      <InteractiveFloatingCard
        icon={Syringe}
        label="Rabies Booster"
        badge="Up to date"
        metric="Valid till 2027"
        className="bottom-2 left-0 sm:bottom-2 sm:left-3"
        delay="180ms"
        iconColor="text-sky-500"
        badgeColor="bg-sky-500/10 text-sky-500 border-sky-500/20"
        glowColor="hover:shadow-sky-500/25 hover:border-sky-500/50"
      />

      <InteractiveFloatingCard
        icon={PawPrint}
        label="Milo"
        badge="Golden Retriever"
        metric="2 yrs • 28 kg"
        className="bottom-0 right-0 sm:bottom-1 sm:right-1"
        delay="270ms"
        iconColor="text-amber-500"
        badgeColor="bg-amber-500/10 text-amber-500 border-amber-500/20"
        glowColor="hover:shadow-amber-500/25 hover:border-amber-500/50"
      />
    </div>
  );
}

function InteractiveFloatingCard({
  icon: Icon,
  label,
  badge,
  metric,
  className,
  delay,
  iconColor,
  badgeColor,
  glowColor,
}) {
  return (
    <div
      className={`animate-tile-in group absolute z-20 flex items-center gap-2.5 rounded-2xl border border-border/80 bg-card/95 px-2.5 py-2 shadow-md backdrop-blur-md transition-all duration-300 ease-out hover:z-30 hover:-translate-y-1 hover:scale-105 hover:shadow-xl sm:gap-3 sm:px-3.5 sm:py-2.5 ${glowColor} ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted/80 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 sm:h-9 sm:w-9">
        <Icon className={`h-4 w-4 transition-colors duration-300 sm:h-5 sm:w-5 ${iconColor}`} strokeWidth={2.2} aria-hidden="true" />
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-foreground transition-colors group-hover:text-primary sm:text-xs">
            {label}
          </span>
          <CheckCircle2
            className="h-3 w-3 text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            aria-hidden="true"
          />
        </div>

        <div className="flex items-center gap-1.5 pt-0.5">
          <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-semibold transition-all sm:text-[10px] ${badgeColor}`}>
            {badge}
          </span>
          <span className="hidden text-[10px] text-muted-foreground transition-colors group-hover:text-foreground sm:inline">
            {metric}
          </span>
        </div>
      </div>
    </div>
  );
}