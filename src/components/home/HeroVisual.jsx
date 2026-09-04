"use client";

import { useState } from "react";
import { PawPrint, HeartPulse, CalendarCheck, Syringe, Sparkles, CheckCircle2 } from "lucide-react";

export default function HeroVisual() {
  const [activeCard, setActiveCard] = useState(null);
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
      className="group/container relative flex h-80 w-full max-w-sm items-center justify-center sm:h-96 sm:max-w-md"
    >
      {/* Interactive cursor follow spotlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover/container:opacity-100"
        style={{
          background: `radial-gradient(240px circle at ${mousePos.x}px ${mousePos.y}px, rgba(var(--primary-rgb, 59, 130, 246), 0.12), transparent 75%)`,
        }}
      />

      {/* Orbit Rings that speed up and glow on container hover */}
      <div className="absolute h-72 w-72 rounded-full border border-primary/10 transition-all duration-700 group-hover/container:scale-105 group-hover/container:border-primary/25 animate-ping [animation-duration:5s]" />
      <div className="absolute h-56 w-56 rounded-full border border-dashed border-primary/20 transition-all duration-700 group-hover/container:scale-105 group-hover/container:border-primary/40 group-hover/container:rotate-45" />
      <div className="absolute h-40 w-40 rounded-full border border-primary/30 transition-all duration-700 group-hover/container:border-accent/40" />

      {/* Central Core with magnetic pulse */}
      <div className="relative z-10 flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-gradient-to-tr from-primary via-primary/80 to-accent p-0.5 shadow-xl shadow-primary/25 transition-all duration-500 hover:scale-115 hover:rotate-12 hover:shadow-2xl hover:shadow-primary/40 active:scale-95">
        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-background/90 backdrop-blur-md">
          <PawPrint className="h-8 w-8 text-primary transition-transform duration-300 hover:scale-110" strokeWidth={2.2} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
              ✓
            </span>
          </span>
        </div>
      </div>

      {/* Top Left: Health Vitals */}
     {/* Top Left: Medical Records */}
      <InteractiveFloatingCard
        id="medical"
        icon={HeartPulse}
        label="Medical Record"
        badge="Updated"
        metric="All clear"
        className="-top-1 -left-2 sm:top-2 sm:left-1"
        animationClass="animate-orbit-1"
        iconColor="text-rose-500"
        badgeColor="bg-rose-500/10 text-rose-500 border-rose-500/20"
        glowColor="group-hover:shadow-rose-500/25 group-hover:border-rose-500/50"
        isActive={activeCard === "medical"}
        onHover={() => setActiveCard("medical")}
        onLeave={() => setActiveCard(null)}
      />

      {/* Top Right: Vet Visit */}
      <InteractiveFloatingCard
        id="vet"
        icon={CalendarCheck}
        label="Vet Checkup"
        badge="Confirmed"
        metric="Tomorrow, 10 AM"
        className="-top-2 -right-2 sm:top-1 sm:right-1"
        animationClass="animate-orbit-2"
        iconColor="text-emerald-500"
        badgeColor="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
        glowColor="group-hover:shadow-emerald-500/25 group-hover:border-emerald-500/50"
        isActive={activeCard === "vet"}
        onHover={() => setActiveCard("vet")}
        onLeave={() => setActiveCard(null)}
      />

      {/* Bottom Left: Vaccination */}
      <InteractiveFloatingCard
        id="vaccine"
        icon={Syringe}
        label="Rabies Booster"
        badge="Up to date"
        metric="Valid till 2027"
        className="-bottom-2 -left-2 sm:bottom-2 sm:left-3"
        animationClass="animate-orbit-2"
        iconColor="text-sky-500"
        badgeColor="bg-sky-500/10 text-sky-500 border-sky-500/20"
        glowColor="group-hover:shadow-sky-500/25 group-hover:border-sky-500/50"
        isActive={activeCard === "vaccine"}
        onHover={() => setActiveCard("vaccine")}
        onLeave={() => setActiveCard(null)}
      />

      {/* Bottom Right: Pet Profile */}
      <InteractiveFloatingCard
        id="pet"
        icon={Sparkles}
        label="Milo"
        badge="Golden Retriever"
        metric="2 yrs • 28 kg"
        className="-bottom-3 -right-2 sm:bottom-1 sm:right-1"
        animationClass="animate-orbit-1"
        iconColor="text-amber-500"
        badgeColor="bg-amber-500/10 text-amber-500 border-amber-500/20"
        glowColor="group-hover:shadow-amber-500/25 group-hover:border-amber-500/50"
        isActive={activeCard === "pet"}
        onHover={() => setActiveCard("pet")}
        onLeave={() => setActiveCard(null)}
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
  animationClass,
  iconColor,
  badgeColor,
  glowColor,
  isActive,
  onHover,
  onLeave,
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`group absolute z-20 flex cursor-pointer items-center gap-3 rounded-2xl border border-border/80 bg-card/95 px-3.5 py-2.5 shadow-md backdrop-blur-md transition-all duration-300 ease-out hover:z-30 hover:scale-110 hover:-translate-y-1 hover:shadow-xl active:scale-95 ${glowColor} ${animationClass} ${className} [animation-play-state:running] hover:[animation-play-state:paused]`}
    >
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/80 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
        <Icon className={`h-5 w-5 transition-colors duration-300 ${iconColor}`} strokeWidth={2.2} />
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-foreground transition-colors group-hover:text-primary">
            {label}
          </span>
          <CheckCircle2 className="h-3 w-3 text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </div>

        <div className="flex items-center gap-1.5 pt-0.5">
          <span className={`rounded-md border px-1.5 py-0.2 text-[10px] font-semibold transition-all ${badgeColor}`}>
            {badge}
          </span>
          <span className="text-[10px] text-muted-foreground transition-colors group-hover:text-foreground">
            {metric}
          </span>
        </div>
      </div>
    </div>
  );
}