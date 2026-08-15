import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { appointments as initialAppointments } from "@/data/appointments";

export const useAppointmentStore = create(
  persist(
    (set) => ({
      appointments: initialAppointments,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      addAppointment: (data) => {
        const newAppointment = {
          id: `appointment-${Date.now()}`,
          status: "scheduled",
          ...data,
        };
        set((state) => ({
          appointments: [...state.appointments, newAppointment],
        }));
        return newAppointment;
      },

      updateAppointment: (appointmentId, updates) => {
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === appointmentId ? { ...a, ...updates } : a
          ),
        }));
      },

      cancelAppointment: (appointmentId) => {
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === appointmentId ? { ...a, status: "cancelled" } : a
          ),
        }));
      },

      removeByPetId: (petId) => {
        set((state) => ({
          appointments: state.appointments.filter((a) => a.petId !== petId),
        }));
      },
    }),
    {
      name: "pet-care-appointments-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);