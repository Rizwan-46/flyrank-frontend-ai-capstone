"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { usePetStore } from "@/store/petStore";
import { useVaccinationStore } from "@/store/vaccinationStore";
import { useMedicalRecordStore } from "@/store/medicalRecordStore";
import { useAppointmentStore } from "@/store/appointmentStore";
import { getVaccinationStatus, getDaysOverdue } from "@/utils/vaccinationStatus";
import { VACCINATION_STATUS } from "@/utils/statusColors";
import { parseDateOnly, getTodayDateOnly } from "@/utils/dateUtils";

import StatCard from "@/components/dashboard/StatCard";
import VaccinationReminders from "@/components/dashboard/VaccinationReminders";
import OverdueVaccinations from "@/components/dashboard/OverdueVaccinations";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";
import RecentMedicalRecords from "@/components/dashboard/RecentMedicalRecords";
import QuickActions from "@/components/dashboard/QuickActions";
import EmptyState from "@/components/dashboard/EmptyState";

import { PawPrint, Syringe, AlertTriangle, CalendarClock } from "lucide-react";

export default function DashboardPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const allPets = usePetStore((state) => state.pets);
  const allVaccinations = useVaccinationStore((state) => state.vaccinations);
  const allMedicalRecords = useMedicalRecordStore((state) => state.medicalRecords);
  const allAppointments = useAppointmentStore((state) => state.appointments);

  const pets = useMemo(
    () => allPets.filter((pet) => pet.userId === currentUser?.id),
    [allPets, currentUser?.id]
  );

  const petsById = useMemo(
    () => Object.fromEntries(pets.map((pet) => [pet.id, pet])),
    [pets]
  );

  const petIds = useMemo(() => pets.map((pet) => pet.id), [pets]);

  const vaccinations = useMemo(
    () => allVaccinations.filter((v) => petIds.includes(v.petId)),
    [allVaccinations, petIds]
  );

  const medicalRecords = useMemo(
    () => allMedicalRecords.filter((r) => petIds.includes(r.petId)),
    [allMedicalRecords, petIds]
  );

  const appointments = useMemo(
    () => allAppointments.filter((a) => petIds.includes(a.petId)),
    [allAppointments, petIds]
  );

  const { upcomingVaccinations, overdueVaccinations } = useMemo(() => {
    const upcoming = [];
    const overdue = [];

    vaccinations.forEach((v) => {
      const status = getVaccinationStatus(v);
      if (
        status === VACCINATION_STATUS.UPCOMING ||
        status === VACCINATION_STATUS.DUE_TODAY
      ) {
        upcoming.push(v);
      } else if (status === VACCINATION_STATUS.OVERDUE) {
        overdue.push(v);
      }
    });

    upcoming.sort(
      (a, b) => parseDateOnly(a.nextDueDate) - parseDateOnly(b.nextDueDate)
    );
    overdue.sort((a, b) => getDaysOverdue(b) - getDaysOverdue(a));

    return { upcomingVaccinations: upcoming, overdueVaccinations: overdue };
  }, [vaccinations]);

  const upcomingAppointments = useMemo(() => {
    const today = getTodayDateOnly();
    return appointments
      .filter((a) => a.status === "scheduled" && parseDateOnly(a.date) >= today)
      .sort((a, b) => parseDateOnly(a.date) - parseDateOnly(b.date));
  }, [appointments]);

  const recentMedicalRecords = useMemo(() => {
    return [...medicalRecords]
      .sort((a, b) => parseDateOnly(b.date) - parseDateOnly(a.date))
      .slice(0, 5);
  }, [medicalRecords]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome back, {currentUser?.name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your pets today.
        </p>
      </div>

      {pets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="No pets yet"
          description="Once you add a pet, their vaccinations, appointments, and medical records will show up here."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={PawPrint} label="Total Pets" value={pets.length} />
            <StatCard
              icon={Syringe}
              label="Upcoming Vaccinations"
              value={upcomingVaccinations.length}
            />
            <StatCard
              icon={AlertTriangle}
              label="Overdue Vaccinations"
              value={overdueVaccinations.length}
            />
            <StatCard
              icon={CalendarClock}
              label="Upcoming Appointments"
              value={upcomingAppointments.length}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <VaccinationReminders
              items={upcomingVaccinations.slice(0, 5)}
              petsById={petsById}
            />
            <OverdueVaccinations
              items={overdueVaccinations.slice(0, 5)}
              petsById={petsById}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UpcomingAppointments
              appointments={upcomingAppointments.slice(0, 5)}
              petsById={petsById}
            />
            <RecentMedicalRecords
              records={recentMedicalRecords}
              petsById={petsById}
            />
          </div>
        </>
      )}

      <QuickActions />
    </div>
  );
}