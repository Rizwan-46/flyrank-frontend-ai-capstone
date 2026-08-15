"use client";

import { useSearchParams } from "next/navigation";
import VaccinationsSection from "@/components/vaccinations/VaccinationsSection";

export default function VaccinationsPage() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Vaccinations
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage vaccinations across all your pets.
        </p>
      </div>

      <VaccinationsSection highlightId={highlightId} />
    </div>
  );
}