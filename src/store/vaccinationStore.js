import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { vaccinations as initialVaccinations } from "@/data/vaccinations";

export const useVaccinationStore = create(
  persist(
    (set) => ({
      vaccinations: initialVaccinations,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      addVaccination: (petId, data) => {
        const newVaccination = {
          id: `vax-${Date.now()}`,
          petId,
          completed: false,
          ...data,
        };
        set((state) => ({
          vaccinations: [...state.vaccinations, newVaccination],
        }));
        return newVaccination;
      },

      updateVaccination: (vaccinationId, updates) => {
        set((state) => ({
          vaccinations: state.vaccinations.map((v) =>
            v.id === vaccinationId ? { ...v, ...updates } : v
          ),
        }));
      },

      deleteVaccination: (vaccinationId) => {
        set((state) => ({
          vaccinations: state.vaccinations.filter((v) => v.id !== vaccinationId),
        }));
      },

      // Completing a vaccination always records what was administered
      // and when the next one is due — never just flips a boolean.
      completeVaccination: (vaccinationId, { administeredDate, nextDueDate }) => {
        set((state) => ({
          vaccinations: state.vaccinations.map((v) =>
            v.id === vaccinationId
              ? { ...v, completed: true, administeredDate, nextDueDate }
              : v
          ),
        }));
      },

      removeByPetId: (petId) => {
        set((state) => ({
          vaccinations: state.vaccinations.filter((v) => v.petId !== petId),
        }));
      },
    }),
    {
      name: "pet-care-vaccinations-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);