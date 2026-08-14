import { PawPrint, HeartPulse, CalendarCheck, Syringe } from "lucide-react";

/**
 * Placeholder hero visual built with plain markup + icons.
 * Designed as a drop-in slot: replace the contents of this
 * component with a 3D canvas (e.g. react-three-fiber) later
 * without changing how Hero.jsx consumes it.
 */
export default function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto flex h-80 w-full max-w-md items-center justify-center rounded-3xl bg-gradient-to-br from-primary/15 via-secondary to-accent/15 sm:h-96"
    >
      <div className="grid grid-cols-2 gap-4 p-8">
        <IconTile icon={PawPrint} />
        <IconTile icon={HeartPulse} />
        <IconTile icon={Syringe} />
        <IconTile icon={CalendarCheck} />
      </div>
    </div>
  );
}

function IconTile({ icon: Icon }) {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card shadow-sm sm:h-24 sm:w-24">
      <Icon className="h-8 w-8 text-primary sm:h-10 sm:w-10" strokeWidth={1.75} />
    </div>
  );
}