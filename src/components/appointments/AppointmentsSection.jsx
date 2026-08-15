"use client";

import { useMemo, useState } from "react";
import { Plus, CalendarClock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { usePetStore } from "@/store/petStore";
import { useAppointmentStore } from "@/store/appointmentStore";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/dashboard/EmptyState";
import AppointmentListItem from "./AppointmentListItem";
import AppointmentFormDialog from "./AppointmentFormDialog";
import CancelAppointmentDialog from "./CancelAppointmentDialog";
import { parseDateOnly } from "@/utils/dateUtils";
import { isAppointmentUpcoming, isAppointmentPast } from "@/utils/appointmentUtils";

export default function AppointmentsSection({ petId = null }) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const allPets = usePetStore((state) => state.pets);
  const allAppointments = useAppointmentStore((state) => state.appointments);
  const addAppointment = useAppointmentStore((state) => state.addAppointment);
  const updateAppointment = useAppointmentStore((state) => state.updateAppointment);
  const cancelAppointment = useAppointmentStore((state) => state.cancelAppointment);

  const [formOpen, setFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [cancellingAppointment, setCancellingAppointment] = useState(null);

  const ownPets = useMemo(
    () => allPets.filter((pet) => pet.userId === currentUser?.id),
    [allPets, currentUser?.id]
  );

  const petsById = useMemo(
    () => Object.fromEntries(ownPets.map((pet) => [pet.id, pet])),
    [ownPets]
  );

  const ownPetIds = useMemo(() => ownPets.map((p) => p.id), [ownPets]);

  const scopedAppointments = useMemo(() => {
    if (petId) return allAppointments.filter((a) => a.petId === petId);
    return allAppointments.filter((a) => ownPetIds.includes(a.petId));
  }, [allAppointments, petId, ownPetIds]);

  const upcoming = useMemo(() => {
    return scopedAppointments
      .filter(isAppointmentUpcoming)
      .sort((a, b) => parseDateOnly(a.date) - parseDateOnly(b.date));
  }, [scopedAppointments]);

  const past = useMemo(() => {
    return scopedAppointments
      .filter(isAppointmentPast)
      .sort((a, b) => parseDateOnly(b.date) - parseDateOnly(a.date));
  }, [scopedAppointments]);

  function handleAddClick() {
    setEditingAppointment(null);
    setFormOpen(true);
  }

  function handleEditClick(appointment) {
    setEditingAppointment(appointment);
    setFormOpen(true);
  }

  function handleFormSubmit(data) {
    if (editingAppointment) {
      updateAppointment(editingAppointment.id, data);
    } else {
      addAppointment(data);
    }
  }

  function handleCancelClick(appointment) {
    setCancellingAppointment(appointment);
  }

  function handleConfirmCancel() {
    if (!cancellingAppointment) return;
    cancelAppointment(cancellingAppointment.id);
    setCancellingAppointment(null);
  }

  const hasAnyAppointments = scopedAppointments.length > 0;

  return (
    <section className="space-y-12" data-testid="appointments-section">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {petId ? "Appointments" : "My Appointments"}
          </h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {upcoming.length} upcoming record{upcoming.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleAddClick}
          disabled={!petId && ownPets.length === 0}
          className="w-full sm:w-auto"
          data-testid="add-appointment-btn"
        >
          <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Add Appointment
        </Button>
      </div>

      {!hasAnyAppointments ? (
        <div data-testid="empty-state-container">
          <EmptyState
            icon={CalendarClock}
            title="No appointments yet"
            description={
              petId
                ? "Schedule this pet's first appointment to get started."
                : "Schedule an appointment for one of your pets to get started."
            }
          />
        </div>
      ) : (
        <>
          {/* Upcoming Appointments */}
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Upcoming
            </h3>
            <div className="mt-4">
              {upcoming.length === 0 ? (
                <EmptyState
                  icon={CalendarClock}
                  title="No upcoming appointments"
                  description="Nothing scheduled right now."
                />
              ) : (
                <div className="space-y-4" data-testid="upcoming-appointments-list">
                  {upcoming.map((appt) => (
                    <AppointmentListItem
                      key={appt.id}
                      appointment={appt}
                      petName={petsById[appt.petId]?.name}
                      showPetName={!petId}
                      onEdit={handleEditClick}
                      onCancel={handleCancelClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <hr className="border-border/50" />

          {/* Past Appointments */}
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Past
            </h3>
            <div className="mt-4">
              {past.length === 0 ? (
                <EmptyState
                  icon={CalendarClock}
                  title="No past appointments"
                  description="Completed and cancelled appointments will appear here."
                />
              ) : (
                <div className="space-y-4" data-testid="past-appointments-list">
                  {past.map((appt) => (
                    <AppointmentListItem
                      key={appt.id}
                      appointment={appt}
                      petName={petsById[appt.petId]?.name}
                      showPetName={!petId}
                      onEdit={handleEditClick}
                      onCancel={handleCancelClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <AppointmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        appointment={editingAppointment}
        pets={ownPets}
        lockedPetId={petId}
        onSubmit={handleFormSubmit}
      />

      <CancelAppointmentDialog
        open={!!cancellingAppointment}
        onOpenChange={(open) => !open && setCancellingAppointment(null)}
        appointment={cancellingAppointment}
        onConfirm={handleConfirmCancel}
      />
    </section>
  );
}