import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { appointments as initialAppointments } from "@/data/appointments";

export const useAppointmentStore = create(
  persist(
    (set) => ({
      appointments: initialAppointments,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

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