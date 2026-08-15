// src/app/(protected)/dashboard/medical-records/page.jsx
"use client";

import { useSearchParams } from "next/navigation";
import MedicalHistorySection from "@/components/medical/MedicalHistorySection";

export default function MedicalRecordsPage() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Medical Records
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage medical records across all your pets.
        </p>
      </div>

      <MedicalHistorySection highlightId={highlightId} />
    </div>
  );
}