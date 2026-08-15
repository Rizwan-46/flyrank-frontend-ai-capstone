"use client";

import AppointmentsSection from "@/components/appointments/AppointmentsSection";

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Appointments
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage appointments across all your pets.
        </p>
      </div>

      <AppointmentsSection />
    </div>
  );
}