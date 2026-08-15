"use client";

import MedicalHistorySection from "@/components/medical/MedicalHistorySection";

export default function MedicalRecordsPage() {
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

      <MedicalHistorySection />
    </div>
  );
}